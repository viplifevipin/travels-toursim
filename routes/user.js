var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var dbConfig=require('../database/dbConfig')
var passport=require('passport')
router.get('/signup',(req,res)=>{
    res.render('users/signup')
})

router.post('/signup',passport.authenticate('local-signUp',{
    successRedirect:'/user/profile',
    failureRedirect:'/user/signup',
    failureFlash:true
}
    ))

router.get('/profile',(req,res)=>{
    res.render('users/profile')
})

router.get('/signin',(req,res)=>{
    res.render('users/signin')
})

module.exports = router;