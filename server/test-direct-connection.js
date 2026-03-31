import mysql from "mysql2/promise";

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: "hopper.proxy.rlwy.net",
      port: 38843,
      user: "root",
      password: "ptpSFGtnUkihtIqsrtfrflaGmAXjTmkl",
      database: "railway",
    });
    
    console.log("✅ Connected to Railway database");
    
    const [restaurants] = await conn.execute("SELECT * FROM restaurants LIMIT 3");
    console.log("📊 Sample restaurants:", restaurants);
    
    const [count] = await conn.execute("SELECT COUNT(*) as cnt FROM restaurants");
    console.log("📈 Total restaurants:", count[0].cnt);
    
    await conn.end();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
})();
