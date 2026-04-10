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

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[ULTRA-SIMPLE] Server listening on ${PORT}`);
  console.log(`[ULTRA-SIMPLE] Ready - requests will be logged`);
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
