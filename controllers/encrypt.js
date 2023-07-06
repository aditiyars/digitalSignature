const fs = require('fs');
const multer = require('multer')
const hash = require('../utils/sha256');
const RSA = require('../utils/rsa');
const archiver = require('archiver');
const path = require('path');
const AdmZip = require('adm-zip');
const rsa = new RSA();
class encrypt{

 
  sign(req, res){

    if(!req.file){
        res.send("File was not found");
    }
    var file = req.file;
    const p = parseInt(req.body.nilaiP);
    const q = parseInt(req.body.nilaiQ);    
    
    //cek nilai p dan q
    const pPrime = encrypt.isPrime(p);
    const qPrime = encrypt.isPrime(q);
    
    if(!pPrime && !qPrime){
      req.flash('type','cl-danger')
      req.flash('message','Nilai p dan q harus prima ')
      
      return res.redirect('/')
    }
    
    if(!encrypt.isPrime(p)){
        req.flash('type','cl-danger')
        req.flash('message','Nilai p harus prima ')
        
        return res.redirect('/')
    }

    if(!encrypt.isPrime(q)){
        req.flash('type','cl-danger')
        req.flash('message','Nilai q harus prima')
        return res.redirect('/')
    }
    
    const buffer = fs.readFileSync(file.path);
    // console.log('buffer : '+ buffer);
    const md = hash(buffer);
    const enkripsi = rsa.encrypt(md, p, q);
    const n = rsa.nilaiN();
    const d = rsa.cariD();
    // const dekripsi = rsa.decrpyt(enkripsi, d, n);
    
    // CREATE TXT FILE
    const dsFilePath = path.join(__dirname , '../temp/DS-'+file.originalname+'.txt');
    const keyFilePath = path.join(__dirname , '../temp/KEY-'+file.originalname+'.txt');
    
    fs.writeFileSync(dsFilePath,enkripsi );    
    fs.writeFileSync(keyFilePath, '++PRIVATE KEY++\n#d='+d+'#n='+ n);    
    fs.unlinkSync(file.path);
    
    // CREATE ZIP FILE
    const outputPath = path.join(__dirname,'../download/DS-'+file.originalname+'.zip');
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', {
      zlib:{ level:9}
    });

    output.on('close', function() {
      console.log('ZIP file created successfully');
    });
    
    archive.on('error', function(error) {
      console.error('Error creating ZIP file:', error);
    });
    
    archive.pipe(output);
    archive.file(dsFilePath, { name: 'DS-'+file.originalname+'.txt'});
    archive.file(keyFilePath, { name: 'KEY-'+file.originalname+'.txt'});
    if(archive.finalize()){
      req.flash('type','cl-1')
      req.flash('message','Berhasil menandatangani dokumen')
    }

    res.redirect("/")

  }

  static isPrime(num){
      // Check if number is less than 2
      if (num < 2) {
        return false;
      }

      // Check if number is 2 or 3
      if (num === 2 || num === 3) {
        return true;
      }

      // Check if number is divisible by 2 or 3
      if (num % 2 === 0 || num % 3 === 0) {
        return false;
      }

      // Check if number is divisible by any odd number from 5 to the square root of the number
      const sqrtNum = Math.sqrt(num);
      for (let i = 5; i <= sqrtNum; i += 2) {
        if (num % i === 0) {
          return false;
        }
      }

      // If none of the above conditions are met, the number is prime
      return true;
    }
}


module.exports = encrypt;
// 4552229353e8a7e78d45d2329606edfa377ba71500e7c04b5f59bf14177e9abf
