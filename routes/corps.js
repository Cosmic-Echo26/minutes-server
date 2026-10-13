const express = require('express');
const router = express.Router();
const path = require('path');

const fileHandler = require('../db/file_handler')


router.get('/test', async (req, res) => {
    try {
        const minutes = await fileHandler.get_entries("test");
        
        res.render(path.join('corps', 'test'), { 
            time: '1:00', 
            day: 'Monday', 
            location: 'Meeting Room', 
            lastmeet: '01/01/2026',
            minutes: minutes
        });
    } catch (error) {
        res.status(500).send(error);
        console.error("Error fetching entries: ", error);
    }
});

module.exports = router;