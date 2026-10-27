const multer = require('multer');
const fs = require('fs');
const path = require('path');

const createDB = require(path.join(__dirname, '..', 'db', 'init_database.js'))

//Initialize multer for file saving
function save_files() {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {

            const subDir = req.params.name || 'undefined';
            const uploadDir = path.join(__dirname, '..', 'public', 'files', subDir);
            
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const parsedFile = path.parse(file.originalname);
            const originalName = parsedFile.name.replace(/\s+/g, '-');
            const ext = parsedFile.ext; // Get the extension (includes the dot)
    
            cb(null, `${originalName}--${new Date().toISOString().slice(0,10)}--${Math.floor((Math.random() * 1000) + 1)}${ext}`);
        }
    });

    return multer({ storage: storage });
}

//Save data & file path in a sqlite database
async function save_data(dateInput, summary, file_path, corp_name) {
    try {
        const db = await createDB(corp_name);
        const query = `INSERT INTO entries (date, summary, file_path) VALUES (?, ?, ?)`;

        return new Promise((resolve, reject) => {
            db.run(query, [dateInput, summary, file_path], function(err) {
                if (err) {
                    console.error("Database error: " + err.message)
                    return reject("Database error: " + err.message);
                }

                resolve({
                    message: "Entry saved successfully!",
                    id: this.lastID,
                    filename: file_path,
                });
            });
        });
    } catch (err) {
        return Promise.reject(err);
        console.log("Error saving file data: ", err)
    }
}

//Save account data
async function save_account(email, password, access) {
    try {
        const db = await createDB("accounts", "email", "password", "access");
        const query = `INSERT INTO entries (email, password, access) VALUES (?, ?, ?)`;

        return new Promise((resolve, reject) => {
            db.run(query, [email, password, access], function(err) {
                if (err) {
                    console.error("Database error: " + err.message)
                    return reject("Database error: " + err.message);
                }

                resolve({
                    message: "Entry saved successfully!",
                    id: this.lastID,
                    email: email,
                });
            });
        });
    } catch (err) {
        return Promise.reject(err);
        console.log("Error saving file data: ", err)
    }
}

//Get data from a sqlite database
async function get_all_entries(name, row1 = "date", row2 = "summary", row3 = "file_path") {
    try {
        const db = await createDB(name);

        return new Promise((resolve, reject) => {
            db.all(`SELECT ${row1}, ${row2}, ${row3} FROM entries ORDER BY date DESC`, [], (err, rows) => {
                if (err) {
                    console.error("Database error: " + err.message);
                    return reject("Database error: " + err.message);
                }

                const formattedEntries = rows.map(row => ({
                    [row1]: row[row1],
                    [row2]: row[row2],
                    fileURL: `/files/${name}/${row[row3]}`
                }));
                

                resolve(formattedEntries);
            });
        });
    } catch (err) {
        return Promise.reject(err);
    }
}

async function get_all_accounts(row1 = "email", row2 = "password", row3 = "access") {
    try {
        const db = await createDB("accounts");

        return new Promise((resolve, reject) => {
            db.all(`SELECT ${row1}, ${row2}, ${row3} FROM entries`, [], (err, rows) => {
                if (err) {
                    console.error("Database error: " + err.message);
                    return reject("Database error: " + err.message);
                }

                const formattedEntries = rows.map(row => ({
                    [row1]: row[row1],
                    [row2]: row[row2],
                    [row3]: row[row3],
                }));
                
                resolve(formattedEntries);
            });
        });
    } catch (err) {
        return Promise.reject(err);
    }
}

async function get_account_by_email(email) {
    try {
        const db = await createDB("accounts");

        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM entries WHERE email = ?", [email], (err, row) => {
                if (err) {
                    console.error("Database error: " + err.message);
                    return reject("Database error: " + err.message);
                }
                resolve(row);
            });
        });
    } catch (err) {
        return Promise.reject(err);
    }
}



module.exports = {
    save_files: save_files,
    save_data: save_data,
    save_account: save_account,
    get_entries: get_all_entries,
    get_accounts: get_all_accounts,
    get_account_by_email: get_account_by_email,
}