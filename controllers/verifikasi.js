const fs = require('fs');
const multer = require('multer')
const hash = require('../utils/sha256');
const RSA = require('../utils/rsa');
const rsa = new RSA();
class verifikasi{
    uji(req, res){
        if(!req.files.dokumen[0]){
            res.send("File was not found");
        }
        if(!req.files.ttd[0]){
            res.send("File was not found");
        }
        if(!req.files.kunci[0]){
            res.send("File was not found");
        }
    
        var dokumen = req.files.dokumen[0];
        var ttd = req.files.ttd[0];
        var kunci = req.files.kunci[0];
    
        const buffer = fs.readFileSync(dokumen.path);
        const ds = fs.readFileSync(ttd.path, 'utf-8');
        const key = fs.readFileSync(kunci.path, 'utf-8');
    
        //hash dokumen
        const md = String(hash(buffer));
    
        //baca kunci
        // cek file kunci
        if(key.slice(0,15) == "++PRIVATE KEY++"){
            const filterD = key.split("#").find(function(v){ 
                return v.indexOf("d") > -1;
            });
            
            const filterN = key.split("#").find(function(v){ 
                return v.indexOf("n") > -1;
            });
              
            const d = parseInt(filterD.split("=")[1]);
            const n = parseInt(filterN.split("=")[1]);
            // console.log('key : '+key+'\nd :'+d+'\nn :'+ n);
            
            //decrypt ttd
            const decrypt = rsa.decrpyt(ds,d,n);
        
            //verifikasi file
            if(md == decrypt){
                req.flash('type','cl-1')
                req.flash('message','Dokumen '+dokumen.originalname+' Valid <br><br> md : ' + md + '<br> dekripsi : '+ decrypt)
            }else{
                req.flash('type','cl-danger')
                req.flash('message','Dokumen '+dokumen.originalname+' Tidak Valid <br><br> md : ' + md + '<br> dekripsi : '+ decrypt)
            }
            
        }else{
            req.flash('type','cl-danger')
            req.flash('message','File Kunci Salah!!!')
        }

        // console.log(req.files);
        res.redirect('/verify');
    }
}

module.exports = verifikasi;