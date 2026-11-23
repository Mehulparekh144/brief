"use client";
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import markdown from "highlight.js/lib/languages/markdown";
import python from "highlight.js/lib/languages/python";
import typescript from "highlight.js/lib/languages/typescript";
import { useMemo } from "react";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("json", json);
hljs.registerLanguage("markdown", markdown);
hljs.registerLanguage("bash", bash);

const BY_EXT: Record<string, string> = { js: "javascript", mjs: "javascript", cjs: "javascript", ts: "typescript", tsx: "typescript", py: "python", json: "json", md: "markdown", sh: "bash" };

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Read-only code view with line numbers and syntax colors. */
export function Code({ path, content }: { path: string; content: string }) {
  const lang = BY_EXT[path.split(".").pop() ?? ""];
  // hljs escapes the source text, so its HTML output is safe to inject.
  const html = useMemo(() => (lang ? hljs.highlight(content, { language: lang }).value : escape(content)), [content, lang]);
  const lines = content.split("\n").length;
  return (
    <div className="code" aria-label={`${path}, read only`}>
      <pre className="gutter" aria-hidden="true">
        {Array.from({ length: lines }, (_, i) => i + 1).join("\n")}
      </pre>
      <pre className="src">
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}
