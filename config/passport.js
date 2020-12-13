const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var FacebookStrategy=require('passport-facebook').Strategy;
const keys=require('./keys');
const LocalStrategy= require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const express = require('express');
var  {check,validationResult}=require('express-validator')

const dbconfig = require('../database/dbConfig');



passport.serializeUser(function(user, done){
    console.log('serializeUser: ' + user)
    done(null, user,user.google);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use('local-signUp',new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},function(req,email,password,done) {


    var errors=validationResult(req).array()

    if(errors.length>0)
    {
        console.log('errrr')
        var messages=[]
        errors.forEach(function(error){
            messages.push(error.msg)
        })
        return done(null,false,req.flash('error',messages))
    }

    dbconfig.get().collection('users').findOne({'email': email}, function (err, user) {

        console.log(email);
        if (err) {
            console.log('err case');
            return done(err);
        }
        if (user) {

            console.log('Email is already in use.');
            return done(null, false, {message: 'Email is already in use.'});
        }

        console.log('Creating New User');

        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(password,salt,(err,hash)=>{
                dbconfig.get().collection('users').insertOne({
                    email: email,
                    password: hash
                }, function (err, data) {
                    if (err) {
                        return done(err);
                    }
                    return done(null, email)
                });
            })
        })



    })
}));


passport.use('local.signIn',new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},function(req,email,password,done) {


    var errors=validationResult(req).array()

    if(errors.length>0)
    {
        console.log('errrr')
        var messages=[]
        errors.forEach(function(error){
            messages.push(error.msg)
        })
        return done(null,false,req.flash('error',messages))
    }
    dbconfig.get().collection('users').findOne({'email': email}, function (err, user) {

        console.log(email);

        if (err) {
            console.log('err case');
            return done(err);
        }
        if (!user) {

            console.log('Email is invalid.');
            return done(null, false, {message: 'Email is invalid.'});
        }
bcrypt.compare(password,user.password,(err,isMatch)=>{
    if (isMatch){
        return done(null,user)
    }
    else {
        return done(null,false,{message:'password incorrect'})
    }
})


    })
}))

passport.use(new GoogleStrategy({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: "http://localhost:3000/auth/google/redirect"
}, function(accessToken, refreshToken, profile, done) {

    process.nextTick(function () {
        dbconfig.get().collection('users').findOne({ 'google': profile.id }, function (err, user) {
            if (err) {
                return done(err)
            }
            if (user)
            {
                return done(null, user);
            }
            dbconfig.get().collection('users').insertOne({
                google:profile.id,
                token:accessToken,
                name:profile.displayName
            }, function (err, data) {
                if (err) {
                    return done(err);
                }
                return done(null,data)
            })
            console.log(profile);
        })
    });
}));

