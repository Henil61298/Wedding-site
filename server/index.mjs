import http from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { resolve, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { openRsvps, saveRsvp } from "./rsvp.mjs";
const root = fileURLToPath(new URL("../", import.meta.url));
const db = openRsvps(
  process.env.RSVP_DB_PATH || resolve(root, "data/rsvps.sqlite"),
);
const dist = resolve(root, "dist");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".m4a": "audio/mp4",
  ".ogg": "audio/ogg",
};
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  const json = (status, data) => {
    res.writeHead(status, {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(JSON.stringify(data));
  };
  if (url.pathname === "/api/rsvp") {
    if (req.method !== "POST")
      return json(405, { error: "Method not allowed." });
    if (!req.headers["content-type"]?.startsWith("application/json"))
      return json(415, { error: "Please send a JSON response." });
    const origin = req.headers.origin;
    if (origin) {
      try {
        if (
          new URL(origin).host !== req.headers.host &&
          !(
            process.env.WEDDING_DEV === "1" &&
            ["http://localhost:5173", "http://127.0.0.1:5173"].includes(origin)
          )
        )
          return json(403, {
            error: "Please submit from the invitation website.",
          });
      } catch {
        return json(403, { error: "Invalid origin." });
      }
    }
    let body = "";
    try {
      for await (const chunk of req) {
        body += chunk;
        if (Buffer.byteLength(body) > 4096)
          return json(413, { error: "Response is too large." });
      }
      let input;
      try {
        input = JSON.parse(body);
      } catch {
        return json(400, { error: "Please check your response." });
      }
      try {
        return json(200, saveRsvp(db, input));
      } catch (error) {
        if (error.message.startsWith("Please"))
          return json(400, { error: error.message });
        throw error;
      }
    } catch (error) {
      console.error("RSVP save failed:", error);
      return json(503, {
        error: "We could not save your response. Please try again shortly.",
      });
    }
  }
  if (url.pathname.startsWith("/api/"))
    return json(404, { error: "Not found." });
  if (!["GET", "HEAD"].includes(req.method)) {
    res.writeHead(405);
    return res.end();
  }
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    res.writeHead(400);
    return res.end();
  }
  let file = resolve(dist, "." + pathname);
  if (!file.startsWith(dist + sep) && file !== dist) {
    res.writeHead(403);
    return res.end();
  }
  if (!existsSync(file) || !statSync(file).isFile()) {
    if (extname(pathname)) {
      res.writeHead(404);
      return res.end("Not found");
    }
    file = resolve(dist, "index.html");
  }
  if (!existsSync(file)) {
    res.writeHead(503);
    return res.end("Build the React application with npm run build first.");
  }
  const size = statSync(file).size;
  const headers = {
    "Content-Type": mime[extname(file)] || "application/octet-stream",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Cache-Control":
      extname(file) === ".html" ? "no-cache" : "public, max-age=3600",
    "Accept-Ranges": "bytes",
  };
  let start = 0,
    end = size - 1,
    status = 200;
  if (req.headers.range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
    if (!match || (!match[1] && !match[2])) {
      res.writeHead(416, { "Content-Range": `bytes */${size}` });
      return res.end();
    }
    if (!match[1]) start = Math.max(0, size - Number(match[2]));
    else start = Number(match[1]);
    if (match[1] && match[2]) end = Math.min(Number(match[2]), size - 1);
    if (start >= size || start < 0 || end < start) {
      res.writeHead(416, { "Content-Range": `bytes */${size}` });
      return res.end();
    }
    status = 206;
    headers["Content-Range"] = `bytes ${start}-${end}/${size}`;
  }
  headers["Content-Length"] = Math.max(0, end - start + 1);
  res.writeHead(status, headers);
  if (req.method === "HEAD" || size === 0) return res.end();
  createReadStream(file, { start, end }).pipe(res);
});
server.listen(
  Number(process.env.PORT || 3001),
  process.env.HOST || "127.0.0.1",
  () =>
    console.log(
      `Wedding server: http://${process.env.HOST || "127.0.0.1"}:${process.env.PORT || 3001}`,
    ),
);
for (const signal of ["SIGTERM", "SIGINT"])
  process.on(signal, () =>
    server.close(() => {
      db.close();
      process.exit(0);
    }),
  );
