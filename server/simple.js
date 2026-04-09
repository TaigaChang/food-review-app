import http from 'http';
import mysql from 'mysql2';
import { Buffer } from 'buffer';

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'food_review_app'
});

db.connect((err) => {
  if (err) console.error('[DB] Error:', err.message);
  else console.log('[DB] Connected');
});

const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  if (req.url === '/api/restaurants' && req.method === 'GET') {
    db.query('SELECT * FROM restaurants LIMIT 100', (err, results) => {
      if (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: err.message }));
        return;
      }
      res.writeHead(200);
      res.end(JSON.stringify({ restaurants: results }));
    });
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[SERVER] Listening on port ${PORT}`);
});
