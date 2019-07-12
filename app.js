require('./helpers/dbconnect')
const express = require('express');
const app = express();
const parser = require('body-parser');
app.use(parser.json())

const userRouter = require('./controllers/user.router');
app.use('/user', userRouter);

module.exports = app;