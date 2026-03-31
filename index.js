import http from "http";

const PORT = parseInt(process.env.PORT) || 3000;

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Backend is running" }));
  } else if (req.url === "/api/restaurants") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ restaurants: [] }));
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on 0.0.0.0:${PORT}`);
});
