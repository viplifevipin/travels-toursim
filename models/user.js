var mongoose = require("mongoose");
var bcrypt=require('bcrypt')

mongoose.connect('mongodb://localhost:27017/mine',{ useNewUrlParser: true,useUnifiedTopology: true },(err)=>{
    if (err){
        throw err
    }
    else {
        console.log('done')
    }
})


var userSchema = new mongoose.Schema({
    email:{
        type: String,
        required:true
    },
    firstName:{
        type: String,
        required:true
    },
    lastName:{
        type: String,
        required:true
    },
    password:{
        type: String,
        required:true
    }
});

module.exports = mongoose.model("User",userSchema);