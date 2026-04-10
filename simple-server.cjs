const http = require('http');

console.log('[SIMPLE] Starting CommonJS server...');
console.log('[SIMPLE] Node:', process.version);
console.log('[SIMPLE] PORT:', process.env.PORT || 8080);

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  console.log(`[SIMPLE] GOT REQUEST: ${req.method} ${req.url}`);
  
  // Handle health checks
  if (req.url === '/health' || req.url === '/' || req.method === 'HEAD') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    if (req.method === 'HEAD') {
      res.end();
    } else {
      res.end(JSON.stringify({ ok: true, message: 'Server is working!' }));
    }
    return;
  }
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ ok: true, message: 'Server is working!' }));
});

console.log('[SIMPLE] About to listen...');

server.listen(PORT, '0.0.0.0', () => {
  console.log('[SIMPLE] ✅ LISTENING on 0.0.0.0:' + PORT);
});

server.on('error', (err) => {
  console.error('[SIMPLE-ERROR]', err.message);
});

server.on('clientError', (err) => {
  console.error('[SIMPLE-CLIENT-ERROR]', err.message);
});

setInterval(() => {
  console.log('[SIMPLE] Still running...');
}, 5000);
