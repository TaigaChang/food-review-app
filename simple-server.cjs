const http = require('http');

console.log('[SIMPLE] Starting CommonJS server...');
console.log('[SIMPLE] Node:', process.version);
console.log('[SIMPLE] PORT:', process.env.PORT || 8080);

const PORT = process.env.PORT || 8080;

const requestHandler = (req, res) => {
  try {
    console.log(`[SIMPLE] GOT REQUEST: ${req.method} ${req.url}`);
    
    res.writeHead(200, { 
      'Content-Type': 'application/json',
      'Connection': 'close'
    });
    
    const response = JSON.stringify({ ok: true, message: 'Server is working!' });
    res.write(response);
    res.end();
    
    console.log(`[SIMPLE] Response sent for: ${req.method} ${req.url}`);
  } catch (err) {
    console.error(`[SIMPLE] Error in handler:`, err.message);
    try {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    } catch (e) {
      // Ignore errors when response already sent
    }
  }
};

const server = http.createServer(requestHandler);

console.log('[SIMPLE] About to listen...');

server.listen(PORT, '0.0.0.0', () => {
  console.log('[SIMPLE] ✅ LISTENING on 0.0.0.0:' + PORT);
  console.log('[SIMPLE] Ready to accept connections');
});

server.on('error', (err) => {
  console.error('[SIMPLE-ERROR]', err.message);
  console.error(err.stack);
});

server.on('clientError', (err, socket) => {
  console.error('[SIMPLE-CLIENT-ERROR]', err.message);
});

// Keep process alive
process.on('SIGTERM', () => {
  console.log('[SIMPLE] SIGTERM received - shutting down gracefully');
  server.close(() => {
    console.log('[SIMPLE] Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('[SIMPLE] SIGINT received - shutting down gracefully');
  server.close(() => {
    console.log('[SIMPLE] Server closed');
    process.exit(0);
  });
});

setInterval(() => {
  console.log('[SIMPLE] Still running...');
}, 5000);
