const sqlite3 = require('sqlite3').verbose();
const path = require('path');

//Create or connect to database. Used mostly in file_handler.js and/or in data saving functions.
function createDB(name, row1 = "date", row2 = "summary", row3 = "file_path") {
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
        ${row1} TEXT NOT NULL,
        ${row2} TEXT NOT NULL,
        ${row3} TEXT NOT NULL,
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