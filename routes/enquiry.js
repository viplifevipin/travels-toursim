var express = require('express');
var router = express.Router();
var nodemailer=require('nodemailer')
var mailGun=require('nodemailer-mailgun-transport')

router.get('/',isLoggedIn,(req,res)=>{
    res.render('enquiry/enquiry')
})

// for posting enquiry 
router.post('/mail',async (req,res,cb)=>{

//     authentication key from mailgun
    const auth={
        auth:{
            api_key:'88834f906878d3a971eaee89c6433ef9-e5da0167-2d43050f',
            domain:'sandbox9727cc59ed794c98a1c6114c6efc28a7.mailgun.org'
        }
    }


    var transporter= nodemailer.createTransport(mailGun(auth))

        const mailOptions={
            from:req.body.email,
            to:'vipinmanalikumbalappara@gmail.com',
            subject:req.body.subject,
            phone:req.body.phone,
            text:req.body.text
        }
        transporter.sendMail(mailOptions,(err,data)=>{
            if (err){
                console.log(err,null)
                cb(err,null)
            }
            else {
                console.log(null,data)
                cb(null,data)
                res.redirect('/')
                console.log('done')
            }
        })

})


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.session.oldURL=req.url
    res.redirect('/user/signin')
}

module.exports=router;
