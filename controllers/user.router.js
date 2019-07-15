const express = require('express');
const router = express.Router();
const { User } = require('../models/user.model')
const { authenticate } = require('../helpers/authenticate')

router.post('/register',(req, res)=>{
    const { email, password, name } = req.body
    User.signUp(email, name, password)
    .then(user=>{
        res.send({
            code: 1,
            data: user,
            message: ''
        })
    })
    .catch(error=>{
        res.send({
            code: 0,
            data: null,
            message: error.message
        })
    })
})

router.post('/login',(req, res)=>{
    const { email, password } = req.body
    User.signIn(email, password)
    .then(user=>{
        res.send({
            code: 1,
            data: user,
            message: ''
        })
    })
    .catch(error=>{
        res.send({
            code: 0,
            data: null,
            message: error.message
        })
    })
})

router.post('/send-friend-request', authenticate, (req, res)=>{
    const { idReceiver } = req.body
    const idSender = req.userId;
    res.send({ idSender,idReceiver })
    // User.sendFriendRequest(idSender,idReceiver)
})

module.exports = router;