const express = require('express');
const router = express.Router();

const fileHandler = require('../db/file_handler')

const account_creation_key = process.env.ACCOUNT_CREATION_KEY;
const account_access_key = process.env.ACCOUNT_ACCESS_KEY;

router.get('/accounts', async (req, res) => {
    if (!req.body.key) res.status(401).send("401 Not authorized")
    else if (req.body.key !== account_access_key) res.status(401).send("401 Not authorized")
    else {
        try {
            const accounts = await fileHandler.get_accounts();

            res.send(accounts)
        } catch (error) {
            res.status(500).send("Error fetching accounts: ", error);
            console.error("Error fetching accounts: ", error);
        }
    }
});


//account management
router.post('/create', (req, res) => {    
    if (!req.body.key) res.status(401).send("401 Not authorized")
    else if (req.body.key !== account_creation_key) res.status(401).send("401 Not authorized")
    else {
        try {
            const email = req.body.email;
            const password = req.body.password;
            const access = JSON.stringify(req.body.access);
    
            const result = fileHandler.save_account(email, password, access);

            res.status(200).send(`Account created, <a href=\"/\">RETURN</a>`);
        } catch (error) {
            res.status(500).send("Error saving account: ", error);
            console.error("Error saving account: ", error)
        }
    }
});

//Session based endpoints. Includes login/logout.
router.post('/login', async (req, res) => {
    console.log("Login request recieved")

    if (!req.body.email || !req.body.password) {
        console.log("Login request failed: bad request"); 
        return res.status(400).send('Email and password required');
    }

    let account;

    try {
        account = await fileHandler.get_account_by_email(req.body.email);
    
        if (!account) {
            console.log("Login request failed: user does not exist"); 
            return res.status(400).send("User does not exist");
        }
    
        if (req.body.password !== account.password) {
            console.log("Login request failed, incorrect password"); 
            return res.status(400).send("Incorrect password"); 
        }
    } catch (error) {
        console.error("Error fetching account: ", error);
        return res.status(500).send("Error fetching account");
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