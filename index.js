const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');

const port = process.env.PORT || 3000;

const app = express();

//bodyparser
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

//import route
const authRoute = require('./router/auth');
app.use('/api/user', authRoute);

//db config
const db = require('./setup/myUrl').mydbUrl;

//Connection
mongoose
    .connect(db, {useNewUrlParser:true, useUnifiedTopology:true})
    .then(() => console.log('Connected to database!!!'))
    .catch(err => console.log(err));

app.listen(port, () => console.log(`Server is running at ${port}`));