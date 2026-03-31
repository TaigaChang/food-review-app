import bcrypt from 'bcrypt';

// Simple script to hash passwords for test users
const password = 'password123';

async function hashPassword() {
  const hash = await bcrypt.hash(password, 10);
  console.log(`Password: ${password}`);
  console.log(`Hash: ${hash}`);
}

hashPassword();
