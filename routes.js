const express = require('express');
const encrypt = require('./controllers/encrypt');
const verifikasi = require('./controllers/verifikasi');
const upload = require('./middleware/upload');

// const media = require('media');
const route = express.Router();
const verifikasiController = new verifikasi();
const encryptController = new encrypt();
// route.get('/'. );

route.get('/', (req, res) => {
    res.render("index", {
        flash:{
            type:req.flash('type') || '',
            message:req.flash('message') || '',
        }
    });
});

route.get('/verify', (req, res) => {
    res.render("verify", {
        flash:{
            type:req.flash('type') || '',
            message:req.flash('message') || '',
        }
    });
});

route.get('/about', (req,res) =>{
    res.render('about')
});



route.post('/sign', upload.single('file'), encryptController.sign);

route.post('/uji', upload.fields([{name:'dokumen'},{name:'ttd'},{name:'kunci'}]), verifikasiController.uji);

module.exports = route;
