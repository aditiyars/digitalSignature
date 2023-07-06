const multer = require('multer');

module.exports = multer({
    storage : multer.diskStorage ({
        destination : (req, file, cb)=>{
            // console.log(file)
            cb(null, 'temp')
        },
        filename : (req, file, cb)=>{
            cb(null, file.originalname)
        }
    })
})