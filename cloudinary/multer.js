const multer=require('multer');

module.exports=multer({
    storage:multer.diskStorage({}),
    filename:(req,file,cb)=>{
        if (!file.mimetype.match(/jpg|jpeg|png|gif$i/)){
            cb(new Error ('file is not supported'),false)
            return
        }
        cb(null,true)
    }
})