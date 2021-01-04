var express = require('express');
var router = express.Router();
let ObjectID = require('mongodb').ObjectID;
const upload=require('../cloudinary/multer')
const cloudinary=require('cloudinary')

require('../cloudinary/cloudinary-confiq')

var dbConfig=require('../database/dbConfig')

router.get('/category',authRole(),(req,res)=>{
    res.render('admin/category')
})

// singles package router editing page
router.get('/single',authRole(),(req,res)=>{
    dbConfig.get().collection('single').find({}).toArray(function (err,docs){
        if (err){
            throw err
        }
        else {
            res.render('admin/single',{docs})
            console.log(docs)
        }
    })
})

// honeymoon package router editing page
router.get('/admin',authRole(), (req, res) => {
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

// adding new package to honeymoon
router.get('/register',function (req,res){
    res.render('admin/register')
})

//adding new package to singles 
router.get('/singleadd',function (req,res){
    res.render('admin/singlereg')
})

// posting honeymoon package
router.post('/register',upload.single('image'),async (req,res,done)=> {

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

// posting single package

router.post('/singleadd',upload.single('image'),async (req,res,done)=> {

    const result = await cloudinary.v2.uploader.upload(req.file.path)
    dbConfig.connect(function (error) {
        if (error) {
            console.log("db unable to connect");
            process.exit(1);

        } else {
            console.log("connect Successfully....");
            dbConfig.get().collection('single').insertMany([{
                imagePath: result.secure_url,
                place: req.body.name,
                price:req.body.price,
                description1:req.body.description1,
                description2:req.body.description2,
                persons:req.body.persons
            }])
            res.redirect('/admin/single')
        }
    })
})

// deleting one package from honeymoon
router.get('/delete/:id',async (req,res)=>{
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

// // deleting one package from singles
router.get('/singledelete/:id',async (req,res)=>{
    var abcId=req.params.id;
    let idString=abcId
    let objId = new ObjectID(idString);
    await dbConfig.get().collection('single').findOneAndDelete({_id:objId},function (err,abc){
        if (err){
            return err
        }
        res.redirect('/admin/single')
    })
})

// editing one package from honeymoon
router.get('/edit/:id',async (req,res)=>{
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
// editing one package from singles
router.get('/singleedit/:id',async (req,res)=>{
    var abcId=req.params.id;
    let idString=abcId
    let objId = new ObjectID(idString);

    await dbConfig.get().collection('single').find({_id:objId}).toArray(function (err,doc){
        if (err){
            return res.write('error')
        }
        res.render('admin/updatesingle',{abc:doc})
    })
})

// posting edited package of honeymoon
router.post('/update/:id', (req,res,callback)=>{
    var abcId=req.params.id;
    let idString=abcId
    let objId = new ObjectID(idString);
    var data= {
        place: req.body.name,
        price:req.body.price,
        description1:req.body.description1,
        description2:req.body.description2
    }
    dbConfig.get().collection('abc').findOneAndUpdate({_id:objId},{$set:data},{returnOrginal:false},function (err,result){
        console.log(result)
        res.redirect('/admin/admin')
    })
})

// posting edited package of singles

router.post('/singleupdate/:id', (req,res,callback)=>{
    var abdId=req.params.id;
    let idString=abdId
    let objId = new ObjectID(idString);
    var data= {
        place: req.body.name,
        price:req.body.price,
        description1:req.body.description1,
        description2:req.body.description2,
        persons:req.body.persons
    }
    dbConfig.get().collection('single').findOneAndUpdate({_id:objId},{$set:data},{returnOrginal:false},function (err,result){
        console.log(result)
        res.redirect('/admin/single')
    })
})


// function for the admin authentication
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
