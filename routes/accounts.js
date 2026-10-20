const express = require('express');
const router = express.Router();

const users = [
    {email: "CosmicEcho1611@proton.me", password: "12345", access: ['test']},
    {email: "test@test.com", password: "67890", access: ['test']}
]

router.post('/login', (req, res) => {
    console.log("Login request recieved")
    
    let account;

    if (!req.body.email || !req.body.password) {
        console.log("Login request failed: bad request"); 
        return res.status(400).send('Email and password required');
    }

    for (let i = 0; i < users.length; i++) {
        if (req.body.email === users[i].email) {
            account = users[i];
            break;
        }
    }
    if (!account) {
        console.log("Login request failed: user does not exist"); 
        return res.status(400).send("User does not exist");
    }
    if (req.body.password !== account.password) {
        console.log("Login request failed, incorrect password"); 
        return res.status(400).send("Incorrect password"); 
    }
    
    req.session.user = account;

    res.status(200).send("Logged in, <a href=\"/\">RETURN</a>");
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    console.log('user logged out')
    res.status(200).send("Logged out, <a href=\"/\">RETURN</a>");
});

router.get('/me', (req, res) => {
    if (req.session && req.session.user) {
        
        res.status(200).json({
            loggedIn: true,
            email: req.session.user.email,
            access: req.session.user.access
        });
    } else {
        res.status(200).json({ loggedIn: false });
    }
})

module.exports = router;