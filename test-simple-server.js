#!/usr/bin/env node

// Ultra-simple server - no middleware, no complexity
const http = require('http');
const fs = require('fs');
const path = require('path');

// Log to both console AND file
const logDir = '/tmp';
const logFile = path.join(logDir, 'railway-app.log');
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

function log(msg) {
  const timestamp = new Date().toISOString();
  const fullMsg = `${timestamp} ${msg}`;
  console.log(fullMsg);
  logStream.write(fullMsg + '\n');
}

const server = http.createServer((req, res) => {
  log(`[RECEIVED] ${req.method} ${req.url}`);
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

log(`[STARTUP] Node.js ${process.version}`);
log(`[STARTUP] PORT=${PORT}`);
log(`[STARTUP] Logging to ${logFile}`);

// Heartbeat - log every 10 seconds to prove app is alive
setInterval(() => {
  log(`[HEARTBEAT] App is alive`);
}, 10000);

server.listen(PORT, '0.0.0.0', () => {
  log(`[ULTRA-SIMPLE] ✅ Server LISTENING on 0.0.0.0:${PORT}`);
  log(`[ULTRA-SIMPLE] Ready to accept connections`);
});

server.on('error', (err) => {
  log(`[ULTRA-SIMPLE-ERROR] ${err.message}`);
});

process.on('uncaughtException', (err) => {
  log(`[UNCAUGHT-EXCEPTION] ${err.message}`);
});

process.on('unhandledRejection', (reason) => {
  log(`[UNHANDLED-REJECTION] ${reason}`);
});
