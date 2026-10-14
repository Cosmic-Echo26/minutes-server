const express = require('express');
const router = express.Router();

const users = [
    {email: "CosmicEcho1611@proton.me", password: "12345", access: ['test']},
    {email: "test@test.com", password: "67890", access: ['test']}
]

router.post('/login', (req, res) => {
    let account;

    if (!req.body.email || !req.body.password) return res.status(400).send('Email and password required');

    for (let i = 0; i < users.length; i++) {
        if (req.body.email === users[i].email) {
            account = users[i];
            break;
        }
    }
    if (!account) res.status(400).send("User does not exist"); return;
    if (req.body.password !== account.password) res.status(400).send("Incorect password"); console.log("test"); return;

    req.session.user = account;

    res.status(200).send("Logged in");
});

module.exports = router;