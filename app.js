const express = require("express");
const app = express();


app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

const PORT = process.env.PORT || 8080

app.get('/', (req, res) => {
    res.render('index')
})


// Routers
corps_router = require('./routes/corps')
app.use('/corps', corps_router);


app.listen(PORT, ()=> {
    console.log(`Server open on port ${PORT}`)
})