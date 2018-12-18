require('dotenv').config();

const express = require('express');
const app = express();
var sequelize = require('./db');

var user = require('./controllers/usercontroller');
var content = require('./controllers/contentcontroller');

var bodyParser = require('body-parser');


sequelize.sync(); ///{force:true} to reset tables in DB
app.use(bodyParser.json());
app.use(require('./middleware/headers'));

app.use('/database/server-test', function(req, res){
    res.send("Its alive!")
})

app.use('/user', user);

app.use('/myaccount', content);


app.listen(process.env.PORT, () => {
    console.log(`CONNECTED TO PORT ${process.env.PORT}`)
});