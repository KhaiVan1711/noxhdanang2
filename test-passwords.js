import mysql from 'mysql2/promise';

const passwords = ["", "root", "123456", "12345678", "admin", "password", "mysql"];

async function run() {
  for (const password of passwords) {
    try {
      const connection = await mysql.createConnection({
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: password
      });
      console.log(`✅ SUCCESS! The password for root is: "${password}"`);
      await connection.end();
      return;
    } catch (err) {
      console.log(`❌ Password: "${password}" - Failed: ${err.message}`);
    }
  }
  console.log("Could not guess the password.");
}

run();
