var express = require('express');
var router = express.Router();
var dbConfig=require('../database/dbConfig')
let async=require('async');

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




module.exports = router;
