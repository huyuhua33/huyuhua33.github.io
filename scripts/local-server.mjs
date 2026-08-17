import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { dirname, extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const host = process.env.CARD_SITE_HOST || "127.0.0.1";
const port = Number.parseInt(process.env.CARD_SITE_PORT || "4173", 10);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".webp": "image/webp"
};

function sendText(response, statusCode, message) {
  response.writeHead(statusCode, {
    "Cache-Control": "no-store",
    "Content-Type": "text/plain; charset=utf-8"
  });
  response.end(message);
}

const server = createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.setHeader("Allow", "GET, HEAD");
    sendText(response, 405, "Method Not Allowed");
    return;
  }

  try {
    const requestUrl = new URL(request.url || "/", `http://${request.headers.host || host}`);
    const pathname = decodeURIComponent(requestUrl.pathname);
    const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
    let filePath = resolve(siteRoot, relativePath);

    if (filePath !== siteRoot && !filePath.startsWith(`${siteRoot}${sep}`)) {
      sendText(response, 403, "Forbidden");
      return;
    }

    const fileStats = await stat(filePath);
    if (fileStats.isDirectory()) filePath = resolve(filePath, "index.html");

    const body = await readFile(filePath);
    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Length": body.length,
      "Content-Type": contentTypes[extname(filePath).toLowerCase()] || "application/octet-stream"
    });
    response.end(request.method === "HEAD" ? undefined : body);
  } catch (error) {
    if (error instanceof URIError) {
      sendText(response, 400, "Bad Request");
      return;
    }

    if (error?.code === "ENOENT") {
      sendText(response, 404, "Not Found");
      return;
    }

    console.error(error);
    sendText(response, 500, "Internal Server Error");
  }
});

server.on("error", error => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use. Set CARD_SITE_PORT to another port.`);
    process.exitCode = 1;
    return;
  }

  throw error;
});

server.listen(port, host, () => {
  console.log(`Scripture Cards is available at http://${host}:${port}`);
  console.log("Press Ctrl+C to stop the local server.");
});
