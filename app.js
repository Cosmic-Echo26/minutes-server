const express = require("express");
const app = express();

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const session = require("express-session");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(session({
    secret: "fXGYhlQNtr",
    saveUninitialized: true,
    resave: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.render('index');
})

// Routers
corps_router = require('./routes/corps');
app.use('/corps', corps_router);

minutes_router = require('./routes/add_minutes');
app.use('/api/add-minutes', minutes_router);

accounts_router = require('./routes/accounts');
app.use('/api/account', accounts_router);


app.listen(PORT, ()=> {
    console.log(`Server open on port ${PORT}`);
})