const express = require('express');
const router = express.Router();
const { User } = require('../models/user.model')

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

module.exports = router;