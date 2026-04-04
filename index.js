import http from 'http';

const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;
  
  console.log(`${new Date().toISOString()} ${method} ${url}`);
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Content-Type', 'application/json');
  
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (url === '/health' || url === '/') {
    res.writeHead(200);
    res.end(JSON.stringify({ ok: true, port: PORT, time: new Date().toISOString() }));
    return;
  }
  
  if (url === '/api/restaurants') {
    // Try to load from database
    (async () => {
      try {
        const { default: pool } = await import('./server/db.js');
        const [rows] = await pool.query('SELECT * FROM restaurants LIMIT 10');
        res.end(JSON.stringify({ restaurants: rows }));
      } catch (e) {
        res.writeHead(503);
        res.end(JSON.stringify({ error: e.message }));
      }
    })();
    return;
  }
  
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[${new Date().toISOString()}] Listening on 0.0.0.0:${PORT}`);
});

process.on('uncaughtException', (e) => {
  console.error('Uncaught:', e);
});
