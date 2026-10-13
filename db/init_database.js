const sqlite3 = require('sqlite3').verbose();
const path = require('path');

function createDB(name) {
  return new Promise((resolve, reject) => {
    const dbPath = path.join(__dirname, `${name}.db`);
    
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Database connection error:', err);
        return reject(err);
      }
      console.log(`Connected to SQLite database: ${name}.db`);
    });

    db.run(`
      CREATE TABLE IF NOT EXISTS entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        summary TEXT NOT NULL,
        file_path TEXT NOT NULL,
        upload_date DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('❌ Table creation error:', err.message);
        return reject(err);
      }
  
      resolve(db);
    });
  });
}
module.exports = createDB;