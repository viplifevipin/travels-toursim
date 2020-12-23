var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var dbConfig=require('../database/dbConfig')
var passport=require('passport')
var  {check,validationResult}=require('express-validator')



router.get('/profile',isLoggedIn,function (req,res){
    dbConfig.get().collection('order').find({user:req.user}).toArray(function(err,orders){
        if (err){
            return res.write('error')
        }
        //res.send(orders)

        res.render('users/profile',{orders:orders});

        console.log(orders)
    });
})

router.get('/logout',isLoggedIn,function (req,res,next) {
    req.logOut()
    res.redirect('/')
})

router.use('/',notLoggedIn,function (req,res,next) {
    next();
})



router.get('/signup',(req,res)=>{
    var messages=req.flash('error');
    res.render('users/signup',{messages:messages,hasErrors:messages.length>0})
})



router.get('/signin',(req,res)=>{

    var messages=req.flash('error');
    res.render('users/signin',{messages:messages,hasErrors:messages.length>0})
})

router.get('/logout', (req,res)=>{
   req.logout();
   res.redirect('/')
})

router.post('/signup',[check('email','Invalid email').isEmail(),check('password','Invalid password.').isLength({min:5})],
    passport.authenticate('local-signUp',
    {
    failureRedirect:'/user/signup',
    failureFlash:true
    }),function(req,res,next){
        if(req.session.oldUrl){
            var oldUrl = req.session.oldUrl;
            req.session.oldUrl = null;
            res.redirect(oldUrl);
        }
        else {
            res.redirect('/user/profile')
        }
    })
router.post('/signin',[check('email','Invalid email').isEmail(),check('password','Invalid password.').isLength({min:5})],passport.authenticate('local.signIn',
    {
        successRedirect:'/user/profile',
        failureRedirect:'/user/signin',
        failureFlash:true
    }
),function(req,res,next){
    if(req.session.oldUrl){
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    }
    else {
        res.redirect('/user/profile')
    }
})


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.session.oldUrl=req.url
    res.redirect('/user/signin')
}


function notLoggedIn(req,res,next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}


module.exports = router;

