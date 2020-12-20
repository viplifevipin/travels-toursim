var express = require('express');
var router = express.Router();
let ObjectID = require('mongodb').ObjectID;
const upload=require('../cloudinary/multer')
const cloudinary=require('cloudinary')

require('../cloudinary/cloudinary-confiq')

var dbConfig=require('../database/dbConfig')

router.get('/admin', authRole(), (req, res) => {
    dbConfig.get().collection('abc').find({}).toArray(function (err,docs){
        if (err){
            throw err
        }
        else {
            res.render('admin/admin',{doc:docs})
            console.log(docs)
        }
    })
})

router.get('/register',authRole,function (req,res){
    res.render('admin/register')
})

router.post('/register',authRole,upload.single('image'),async (req,res,done)=> {

    const result = await cloudinary.v2.uploader.upload(req.file.path)
    dbConfig.connect(function (error) {
        if (error) {
            console.log("db unable to connect");
            process.exit(1);

        } else {
            console.log("connect Successfully....");
            dbConfig.get().collection('abc').insertMany([{
                imagePath: result.secure_url,
                place: req.body.name,
                price:req.body.price,
                description1:req.body.description1,
                description2:req.body.description2
            }])
            res.redirect('/admin/admin')
        }
    })
})

router.get('/delete/:id',authRole,async (req,res)=>{
    var abcId=req.params.id;
    let idString=abcId
    let objId = new ObjectID(idString);
    await dbConfig.get().collection('abc').findOneAndDelete({_id:objId},function (err,abc){
        if (err){
            return err
        }
        res.redirect('/admin/admin')
    })
})

router.get('/edit/:id',authRole,async (req,res)=>{
    var abcId=req.params.id;
    let idString=abcId
    let objId = new ObjectID(idString);

   await dbConfig.get().collection('abc').find({_id:objId}).toArray(function (err,doc){
        if (err){
            return res.write('error')
        }
        res.render('admin/update',{abc:doc})
    })

})

router.post('/update/:id',authRole,async (req,res,callback)=>{
    var abcId=req.params.id;
    let idString=abcId
    let objId = new ObjectID(idString);
    var data= {
        place: req.body.name,
        price:req.body.price,
        description1:req.body.description1,
        description2:req.body.description2
    }
    await dbConfig.get().collection('abc').findOneAndUpdate({_id:objId},{$set:data},{returnOrginal:false},function (err,result){
        console.log(result)
        res.redirect('/admin/admin')
    })
})



function authRole() {
    return (req, res, next) => {
        if (req.user.role !== 'admin') {
            res.status(401)
            res.redirect('/')
        }
        next()
    }
}
module.exports = router;