// Absolute minimal server - no dependencies except Node built-ins
import http from 'http';

const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
  console.log(`[MINIMAL] ${new Date().toISOString()} ${req.method} ${req.url}`);
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    message: 'Minimal server works!',
    time: new Date().toISOString(),
    port: PORT,
    node_env: process.env.NODE_ENV
  }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[MINIMAL] Listening on 0.0.0.0:${PORT}`);
});

process.on('uncaughtException', (err) => {
  console.error('[MINIMAL] ERROR:', err);
});
