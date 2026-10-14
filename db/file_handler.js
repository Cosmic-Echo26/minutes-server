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
            const originalName = path.parse(file.originalname).name.replace(/\s+/g, '-');
            cb(null, `${originalName}--${new Date().toISOString().slice(0,10)}--${Math.floor((Math.random() * 1000) + 1)}`);
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

//Get data from a sqlite database
async function get_all_entries(corp_name) {
    try {
        const db = await createDB(corp_name);

        return new Promise((resolve, reject) => {
            db.all(`SELECT date, summary, file_path FROM entries ORDER BY date DESC`, [], (err, rows) => {
                if (err) {
                    console.error("Database error: " + err.message);
                    return reject("Database error: " + err.message);
                }

                const formattedEntries = rows.map(row => ({
                    date: row.date,
                    summary: row.summary,
                    fileUrl: `/files/${corp_name}/${row.file_path}`
                }));

                resolve(formattedEntries);
            });
        });
    } catch (err) {
        return Promise.reject(err);
    }
}



module.exports = {
    save_files: save_files,
    save_data: save_data,
    get_entries: get_all_entries,
}