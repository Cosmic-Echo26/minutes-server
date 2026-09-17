const express = require('express');
const router = express.Router();
const path = require('path');

const historicalMinutes = [
    { date: '01/01/2026', summary: 'Discussed plans to expand testing', fileUrl: '/download/jan1.docx' },
    { date: '01/08/2026', summary: 'Canceled old tests', fileUrl: '/download/jan8.md' },
    { date: '01/15/2026', summary: 'Expanded testing page', fileUrl: '/download/jan15.docx' },
    { date: '01/01/2026', summary: 'Discussed plans to expand testing', fileUrl: '/download/jan1.docx' },
    { date: '01/08/2026', summary: 'Canceled old tests', fileUrl: '/download/jan8.md' },
    { date: '01/15/2026', summary: 'Expanded testing page', fileUrl: '/download/jan15.docx' },
    { date: '01/01/2026', summary: 'Discussed plans to expand testing', fileUrl: '/download/jan1.docx' },
    { date: '01/08/2026', summary: 'Canceled old tests', fileUrl: '/download/jan8.md' },
    { date: '01/15/2026', summary: 'Expanded testing page', fileUrl: '/download/jan15.docx' },
];


router.get('/test', (req, res)=> {
    minutes = historicalMinutes;


    res.render(path.join('corps', 'test'), { 
        time: '1:00', 
        day: 'Monday', 
        location: 'Meeting Room', 
        lastmeet: '01/01/2026',

        minutes: minutes
    })
})

module.exports = router;