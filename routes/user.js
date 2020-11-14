var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var dbConfig=require('../database/dbConfig')
var passport=require('passport')
var  {check,validationResult}=require('express-validator')



router.get('/signup',(req,res)=>{
    var messages=req.flash('error');
    res.render('users/signup',{messages:messages,hasErrors:messages.length>0})
})

router.get('/profile',(req,res)=>{
    res.render('users/profile')
})

router.get('/signin',(req,res)=>{
    var messages=req.flash('error');
    res.render('users/signin',{messages:messages,hasErrors:messages.length>0})
})

router.post('/signup',[check('email','Invalid email').isEmail(),check('password','Invalid password.').isLength({min:5})],
    passport.authenticate('local-signUp',
    {
    successRedirect:'/user/profile',
    failureRedirect:'/user/signup',
    failureFlash:true
    }
    ))
router.post('/signin',[check('email','Invalid email').isEmail(),check('password','Invalid password.').isLength({min:5})],passport.authenticate('local.signIn',
    {
        successRedirect:'/user/profile',
        failureRedirect:'/user/signin',
        failureFlash:true
    }

))


module.exports = router;