const express = require('express');
const router = express.Router();
const { Post } = require('../models/post.model')

router.post('/create', (req, res)=>{
    const { content } = req.body
    const author = req.userId
    Post.createPost(author,content)
    .then(post=>res.send({
        code: 1,
        data: post,
        message: ''
    }))
    .catch(error=>res.send({
        code: 0,
        data: null,
        message: error.message
    }))
})
module.exports = router