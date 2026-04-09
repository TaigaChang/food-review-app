import mysql from 'mysql2/promise';

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'food_review_app',
    });

    const [rows] = await connection.execute('SELECT * FROM restaurants LIMIT 100');
    await connection.end();

    return Response.json({ restaurants: rows });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
