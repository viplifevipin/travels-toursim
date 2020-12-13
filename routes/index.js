var express = require('express');
var router = express.Router();
var dbConfig=require('../database/dbConfig')
let async=require('async');
var passport=require('passport');

/* GET home page. */
router.get('/',(req ,res)=>{

    let locals = {};
    let tasks = [
        function (callback) {
            dbConfig.get().collection('hellosi').find({}).toArray(function (error, room) {
                if (error) return callback(error);
                console.log('room details on dashboard' + room);
                locals.room = room;
                callback();
            })
        },
        function (callback) {
            dbConfig.get().collection('hey').find({}).toArray(function (error, croom) {
                if (error) return callback(error);
                console.log('customer details on dashboard' + croom);
                locals.croom = croom;
                callback();
            })
        }
    ];
    async.parallel(tasks, function (err) {
        if (err) return next(err);
        console.log('hey!!!!!!!!!!!!!!!!!' + locals);
        console.log(locals);
        res.render('home/index', locals)
    });

    })


router.get('/google', passport.authenticate('google',{
    scope:['profile']
}))


// router.get('/auth/facebook',
//     passport.authenticate('facebook'));


router.get('/auth/google/redirect',
    passport.authenticate('google', { failureRedirect: '/google' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

// router.get('/auth/facebook/callback',
//     passport.authenticate('facebook', { failureRedirect: '/facebook' }),
//     function(req, res) {
//         // Successful authentication, redirect home.
//         res.redirect('/');
//     });

router.get('/packages',(req,res)=>{
     dbConfig.get().collection('abc').find({}).toArray(function (err,docs){
         if (err){
             throw err
         }
         else {
             res.render('packages/packages',{doc:docs})
         }
     })
})




function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}


function notLoggedIn(req,res,next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}

module.exports = router;
