const http = require("http");
const fs = require("fs");
const path = require("path");

const port = Number(process.env.PORT || 4173);
const root = __dirname;

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url.split("?")[0] === "/api/extract-document") {
    readJsonBody(req)
      .then((payload) => extractWithConfiguredModel(payload))
      .then((payload) => sendJson(res, 200, payload))
      .catch((error) => sendJson(res, error.statusCode || 500, { error: error.message }));
    return;
  }

  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  const requested = urlPath === "/" ? "/index.html" : urlPath;
  const filePath = path.normalize(path.join(root, requested));

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": types[path.extname(filePath)] || "application/octet-stream",
    });
    res.end(data);
  });
});

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 2_000_000) {
        reject(Object.assign(new Error("Request body too large"), { statusCode: 413 }));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        reject(Object.assign(new Error("Invalid JSON body"), { statusCode: 400 }));
      }
    });
    req.on("error", reject);
  });
}

async function extractWithConfiguredModel(payload) {
  if (!process.env.GENAI_EXTRACTION_ENDPOINT) {
    throw Object.assign(new Error("No GenAI extraction endpoint configured"), { statusCode: 404 });
  }

  const response = await fetch(process.env.GENAI_EXTRACTION_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.GENAI_EXTRACTION_TOKEN ? { Authorization: `Bearer ${process.env.GENAI_EXTRACTION_TOKEN}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw Object.assign(new Error(`GenAI extraction failed with status ${response.status}`), { statusCode: 502 });
  }

  return response.json();
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

server.listen(port, () => {
  process.stdout.write(`QA Release Intelligence running at http://localhost:${port}\n`);
});
