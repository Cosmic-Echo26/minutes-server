const express = require('express');
const router = express.Router();

const fileHandler = require('../db/file_handler');
const upload = fileHandler.save_files();

router.post('/:name', upload.single('fileUpload'), async (req, res) => {
    if (!req.session || !req.session.email || !req.session.access.includes('test')) return res.status(401).send("401 Unauthorized");
    
    try {
        const dateInput = req.body.dateInput;
        const summary = req.body.summary;
        const filename = req.file ? req.file.filename : null;

        if (!filename) {
            return res.status(400).send("File is required.");
        }

        const result = await fileHandler.save_data(dateInput, summary, filename, req.params.name);
        
        res.status(200).send(`Minutes Added, <a href=\"/corps/${req.params.name}\">RETURN</a>`);
    } catch (error) {
        res.status(500).send(error);
        console.error("Error saving minutes: ", error)
    }
});

module.exports = router;