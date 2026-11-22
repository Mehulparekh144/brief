import type { NextRequest } from "next/server";
import { apiUser } from "@/lib/auth.ts";
import { type Ev, getLive, listFiles, publicTests, readFile, sendMessage, stopAgent, submitSession, UserError } from "@/lib/live.ts";

type Ctx = { params: Promise<{ id: string; action: string }> };

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
  let cleanup = () => {};
  const stream = new ReadableStream({
    start(controller) {
      const send = (ev: Ev) => {
        try {
          controller.enqueue(enc.encode(`id: ${ev.seq}\ndata: ${JSON.stringify(ev)}\n\n`));
        } catch {
          cleanup();
        }
      };
      for (const ev of l.events) if (ev.seq > after) send(ev);
      l.listeners.add(send);
      const ping = setInterval(() => send({ seq: 0, kind: "ping", data: {} }), 20_000);
      cleanup = () => {
        l.listeners.delete(send);
        clearInterval(ping);
      };
      req.signal.addEventListener("abort", () => {
        cleanup();
        try {
          controller.close();
        } catch {}
      });
    },
    cancel() {
      cleanup();
    },
  });
  return new Response(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive" } });
}

/** POST messages {text} | stop | tests | submit */
export async function POST(req: NextRequest, { params }: Ctx) {
  const me = await apiUser();
  if (me instanceof Response) return me;
  const { id, action } = await params;
  const l = getLive(id, me.id);
  if (!l) return gone();
  try {
    if (action === "messages") sendMessage(l, String((await req.json().catch(() => ({}))).text ?? ""));
    else if (action === "stop") stopAgent(l);
    else if (action === "tests") await publicTests(l);
    else if (action === "submit") void submitSession(l);
    else return Response.json({ error: "Not found." }, { status: 404 });
    return Response.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
