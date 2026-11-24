import type { NextRequest } from "next/server";
import { apiUser, jsonBody } from "@/lib/auth.ts";
import { type Ev, getLive, listFiles, publicTests, readFile, sendMessage, stopAgent, submitSession, UserError } from "@/lib/live.ts";

type Ctx = { params: Promise<{ id: string; action: string }> };

const TERMINAL = new Set(["submitted", "ended"]);

const gone = () => Response.json({ error: "This workspace is no longer running." }, { status: 410 });

function fail(e: unknown) {
  if (e instanceof UserError) return Response.json({ error: e.message }, { status: e.status });
  console.error("session action:", e);
  return Response.json({ error: "Something went wrong. Try again." }, { status: 500 });
}

/** GET stream: live steps as Server-Sent Events. GET files: list, or ?path= for one file. */
export async function GET(req: NextRequest, { params }: Ctx) {
  const me = await apiUser();
  if (me instanceof Response) return me;
  const { id, action } = await params;
  const l = getLive(id, me.id);
  if (!l) return gone();

  if (action === "files") {
    try {
      const path = req.nextUrl.searchParams.get("path");
      return path ? Response.json({ path, content: await readFile(l, path) }) : Response.json({ files: await listFiles(l) });
    } catch (e) {
      return fail(e);
    }
  }
  if (action !== "stream") return Response.json({ error: "Not found." }, { status: 404 });

  const after = Number(req.headers.get("last-event-id") ?? 0);
  const enc = new TextEncoder();
  let ping: NodeJS.Timeout | undefined;
  let done = false;
  let send: (ev: Ev) => void = () => {};
  const stream = new ReadableStream({
    start(controller) {
      const finish = () => {
        if (done) return;
        done = true;
        l.listeners.delete(send); // frees the stream and its reference to the session
        clearInterval(ping);
        try {
          controller.close();
        } catch {}
      };
      const write = (text: string) => {
        try {
          controller.enqueue(enc.encode(text));
        } catch {
          finish();
        }
      };
      send = (ev: Ev) => {
        if (done) return;
        write(`id: ${ev.seq}\ndata: ${JSON.stringify(ev)}\n\n`);
        if (TERMINAL.has(ev.kind)) finish(); // the session is over
      };
      for (const ev of l.events) if (ev.seq > after) send(ev);
      if (done) return;
      l.listeners.add(send);
      ping = setInterval(() => write(": ping\n\n"), 20_000); // a comment line: keeps proxies open, leaves Last-Event-ID alone
      req.signal.addEventListener("abort", finish);
    },
    cancel() {
      done = true;
      l.listeners.delete(send);
      clearInterval(ping);
    },
  });
  return new Response(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive" } });
}

/** POST messages {text} | stop | tests | submit */
export async function POST(req: NextRequest, { params }: Ctx) {
  const me = await apiUser();
  if (me instanceof Response) return me;
  const body = await jsonBody(req);
  if (body instanceof Response) return body;
  const { id, action } = await params;
  const l = getLive(id, me.id);
  if (!l) return gone();
  try {
    if (action === "messages") sendMessage(l, String(body.text ?? ""));
    else if (action === "stop") stopAgent(l);
    else if (action === "tests") await publicTests(l);
    else if (action === "submit") void submitSession(l);
    else return Response.json({ error: "Not found." }, { status: 404 });
    return Response.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
