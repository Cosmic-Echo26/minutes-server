const express = require('express');
const router = express.Router();
const path = require('path');

const fileHandler = require('../db/file_handler')

const corps = [
    "test",
]

router.get('/:name', async (req, res) => {
    if (!corps.includes(req.params.name)) {
        res.status(404).send("404 Not found");
        return;
    }

    try {

        const minutes = await fileHandler.get_entries(req.params.name);
        
        res.render(path.join('corps', req.params.name), { 
            lastmeet: minutes[0].date,
            minutes: minutes
        });
    } catch (error) {
        res.status(500).send(error);
        console.error("Error fetching entries: ", error);
    }
});

module.exports = router;