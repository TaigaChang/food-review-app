// Ultra minimal - only Node built-ins, no npm packages
import http from 'http';

console.log('[ULTRA] Starting');

const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    ok: true,
    time: new Date().toISOString(),
    port: PORT,
    env: process.env.NODE_ENV
  }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[ULTRA] Listening on ${PORT}`);
});
