const http = require('http');

console.log('[SIMPLE] Starting CommonJS server...');
console.log('[SIMPLE] Node:', process.version);
console.log('[SIMPLE] PORT:', process.env.PORT || 8080);

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  console.log(`[SIMPLE] GOT REQUEST: ${req.method} ${req.url}`);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ ok: true, message: 'Server is working!' }));
});

console.log('[SIMPLE] About to listen...');

server.listen(PORT, '0.0.0.0', () => {
  console.log('[SIMPLE] ✅ LISTENING on 0.0.0.0:' + PORT);
});

setInterval(() => {
  console.log('[SIMPLE] Still running...');
}, 5000);
