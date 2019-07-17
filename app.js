require('./helpers/dbconnect')
const express = require('express');
const app = express();
const parser = require('body-parser');
const {authenticate} = require('./helpers/authenticate')
app.use(parser.json())

const userRouter = require('./controllers/user.router');
const postRouter = require('./controllers/post.router');
app.use('/user', userRouter);
app.use('/post', authenticate, postRouter);

module.exports = app;