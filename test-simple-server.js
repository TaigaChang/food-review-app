#!/usr/bin/env node

// Ultra-simple server - no middleware, no complexity
const http = require('http');

const server = http.createServer((req, res) => {
  console.log(`[RECEIVED] ${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ 
    message: 'Ultra-simple server working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    path: req.url.split('?')[0]
  }));
});

const PORT = process.env.PORT || 8080;

console.log(`[STARTUP] Node.js ${process.version}`);
console.log(`[STARTUP] PORT=${PORT}`);

// Heartbeat - log every 10 seconds to prove app is alive
setInterval(() => {
  console.log(`[HEARTBEAT] ${new Date().toISOString()} - App is alive`);
}, 10000);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[ULTRA-SIMPLE] ✅ Server LISTENING on 0.0.0.0:${PORT}`);
  console.log(`[ULTRA-SIMPLE] Ready to accept connections`);
});

server.on('error', (err) => {
  console.error(`[ULTRA-SIMPLE-ERROR]`, err);
});

process.on('uncaughtException', (err) => {
  console.error(`[UNCAUGHT-EXCEPTION]`, err);
});

process.on('unhandledRejection', (reason) => {
  console.error(`[UNHANDLED-REJECTION]`, reason);
});
