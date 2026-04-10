// Root entry point - simply runs the server
console.log(`[ROOT] Starting at ${new Date().toISOString()}`);
console.log(`[ROOT] NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`[ROOT] PORT: ${process.env.PORT}`);
console.log(`[ROOT] CWD: ${process.cwd()}`);
console.log(`[ROOT] About to import server/index.js...`);

try {
  await import('./server/index.js');
  console.log(`[ROOT] ✅ Server module imported and running`);
} catch (err) {
  console.error(`[ROOT] ❌ FATAL ERROR:`, err.message);
  console.error(`[ROOT] Stack:`, err.stack);
  process.exit(1);
}
