const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended : false}));

var Users = require('./Routes/Users.js');

app.use('/user',Users);

app.listen(PORT, ()=>{
    console.log(`Le serveur tourne sur le port ${PORT}`);
})