var express = require('express');
var router = express.Router();
const qs = require('querystring')
let ObjectID = require('mongodb').ObjectID;
var dbConfig=require('../database/dbConfig')
let async=require('async');
var passport=require('passport');
const checksum_lib = require('../Paytm_Web_Sample_Kit_NodeJs/checksum/checksum')
const config = require('../paytm/config')

/* GET home page. */
router.get('/',(req ,res)=>{

    let locals = {};
    let tasks = [
        function (callback) {
//             geting the images for the slide show
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


// for the google authentication using passportjs
router.get('/google', passport.authenticate('google',{
    scope:['profile']
}))

// redirecting to localhost
router.get('/auth/google/redirect',
    passport.authenticate('google', { failureRedirect: '/google' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

// search option for packages searching using fuzzy search (honey moon package)
 router.get('/packages',(req,res)=>{
    var successMsg=req.flash('success')[0];
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        dbConfig.get().collection('abc').find({place:regex}).toArray(function (err,docs){
            if (err){
                throw err
            }
            else {
                res.render('packages/packages',{doc:docs,successMsg:successMsg, noMessages:!successMsg})
            }
        })
    }
    else {
        dbConfig.get().collection('abc').find({}).toArray(function (err,docs){
            if (err){
                throw err
            }
            else {
                res.render('packages/packages',{doc:docs ,successMsg:successMsg, noMessages:!successMsg})
            }
        })
    }


})

// search option for packages searching using fuzzy search (singles package)
router.get('/single',(req,res)=>{

    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        dbConfig.get().collection('single').find({place:regex}).toArray(function (err,docs){
            if (err){
                throw err
            }
            else {
                res.render('packages/single',{a:docs})
            }
        })
    }
    else {
        dbConfig.get().collection('single').find({}).toArray(function (err,docs){
            if (err){
                throw err
            }
            else {
                res.render('packages/single',{a:docs})
            }
        })
    }


})

router.get('',isLoggedIn,(req,res)=>{
    dbConfig.get().collection('abc').findOne({})

})
// packages router for payment
router.get('/payment/:id',isLoggedIn,async (req,res)=>{
    var abcId=req.params.id;
    let idString=abcId
    let objId = new ObjectID(idString);


    await dbConfig.get().collection('abc').find({_id:objId}).toArray(function (err,doc){
        if (err){
            return res.write('error')
        }
        res.render('payment/payment',{abc:doc})
    })
})
// packages router for payment

router.get('/best/:id',isLoggedIn,async (req,res)=>{
    var abcId=req.params.id;
    let idString=abcId
    let objId = new ObjectID(idString);


    await dbConfig.get().collection('hey').find({_id:objId}).toArray(function (err,doc){
        if (err){
            return res.write('error')
        }
        res.render('payment/payment',{abc:doc})
    })
})
// packages router for payment

router.get('/alone/:id',isLoggedIn,async (req,res)=>{
    var abcId=req.params.id;
    let idString=abcId
    let objId = new ObjectID(idString);


    await dbConfig.get().collection('single').find({_id:objId}).toArray(function (err,doc){
        if (err){
            return res.write('error')
        }
        res.render('payment/payment',{abc:doc})
    })
})



// payment method with paytm

router.post('/paynow', (req, res) => {


    if (!req.body.amount || !req.body.email || !req.body.phone) {
        res.status(400).send('Payment failed')
    } else {
        var params = {};
        params['MID'] = config.PaytmConfig.mid;
        params['WEBSITE'] = config.PaytmConfig.website;
        params['CHANNEL_ID'] = 'WEB';
        params['INDUSTRY_TYPE_ID'] = 'Retail';
        params['ORDER_ID'] = 'TEST_' + new Date().getTime();
        params['CUST_ID'] = 'customer_001';
        params['TXN_AMOUNT'] = req.body.amount.toString();
        params['CALLBACK_URL'] = 'http://localhost:3000/callback';
        params['EMAIL'] = req.body.email;
        params['MOBILE_NO'] = req.body.phone.toString();
 var order={
     user:req.user,
     amount:req.body.amount,
     email:req.body.email,
     phone:req.body.phone,
     place: req.body.place
 }

        dbConfig.get().collection('order').insertOne(order)

        checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {
            var txn_url = "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
            // var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production

            var form_fields = "";
            for (var x in params) {
                form_fields += "<input type='hidden' name='" + x + "' value='" + params[x] + "' >";
            }
            form_fields += "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' >";

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write('<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="' + txn_url + '" name="f1">' + form_fields + '</form><script type="text/javascript">document.f1.submit();</script></body></html>');
            res.end();
        });
    }
})

router.post('/callback', (req, res) => {
    var body = '';

    req.on('data', function (data) {
        body += data;
    });

    req.on('end', function () {
        var html = "";
        var post_data = qs.parse(body);

        // received params in callback
        console.log('Callback Response: ', post_data, "\n");


        // verify the checksum
        var checksumhash = post_data.CHECKSUMHASH;
        // delete post_data.CHECKSUMHASH;
        var result = checksum_lib.verifychecksum(post_data, config.PaytmConfig.key, checksumhash);
        console.log("Checksum Result => ", result, "\n");


        // Send Server-to-Server request to verify Order Status
        var params = {"MID": config.PaytmConfig.mid, "ORDERID": post_data.ORDERID};

        checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {

            params.CHECKSUMHASH = checksum;
            post_data = 'JsonData='+JSON.stringify(params);

            var options = {
                hostname: 'securegw-stage.paytm.in', // for staging
                // hostname: 'securegw.paytm.in', // for production
                port: 443,
                path: '/merchant-status/getTxnStatus',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': post_data.length
                }
            };


            // Set up the request
            var response = "";
            var post_req = https.request(options, function(post_res) {
                post_res.on('data', function (chunk) {
                    response += chunk;
                });

                post_res.on('end', function(){
                    console.log('S2S Response: ', response, "\n");

                    var _result = JSON.parse(response);
                    if(_result.STATUS == 'TXN_SUCCESS') {
                        res.send('payment sucess')
                    }else {
                        res.send('payment failed')
                    }
                });
            });

            // post the data
            post_req.write(post_data);
            post_req.end();
        });
    });
    req.flash('success','successfully booked')
    req.session.cart=null;
    res.redirect('/packages')
})


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


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
