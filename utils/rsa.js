const bigInt = require('big-integer');

// algoritma rsa
/**
 *  Besaran-besaran yang digunakan pada algoritma RSA
 * 
 * p dan q bilangan prima       (rahasia)
 * n = p * q                    (tidak rahasia)
 * Φ(n) = (p-1) * (q-1)         (rahasia)
 * e (kunci enkripsi)           (tidak rahasia)
 * d (kunci dekripsi)           (rahasia)
 * m (plainteks)                (rahasia)
 * c (cipherteks)               (tidak rahasia)
 * 
 * e merupakan (PBB(e, phiN)) = 1, PBB = gcd
 * d = e^-1 mod phiN
 */
class RSA{

    constructor(){
        this.d = 0;
        this.phiN = 0;
        this.e = 0;
        this.n = 0;
    }
    
    gcd(a, b){
        if( b == 0){
            return a;
        }else{
            return this.gcd(b, a %b);
        }
    }

    // Menghasilkan bilangan acak untuk nilai e
    randomInt(max) {
        return Math.floor(Math.random() * max) + 1;
    }

    cariE(){
        
        while (this.gcd(this.phiN, this.e) !== 1) {
            this.e = this.randomInt(this.phiN);
        }
        return this.e;
    }

    cariD(){
        for(let k = 1;k<this.phiN;k++){
            const temp = (1+k*this.phiN)/this.e;
            if(Number.isInteger(temp)){
                this.d = temp;
                break;
            }
        }
        return this.d;
    }

    wordsToAscii(s){
        const charCodeArr = []
        for(let i = 0; i < s.length; i++){
            let code = s.charCodeAt(i);
            charCodeArr.push(code);
        }

        return charCodeArr
    }

    encrypt(message, p, q){
        this.n = p * q;
        console.log("menghitung nilai n : "+ this.n)
        // console.log('n : ' + n)
        
        this.phiN = (p-1) * (q-1);
        
        this.e = this.randomInt(this.phiN);
        console.log('e awal (random) : '+ this.e)
        
        this.e = this.cariE();
        console.log("nilai kunci publik : "+ this.e)
        
        let d;
        this.cariD();
        console.log("nilai kunci privat : "+ this.d)
        
        console.log("mengkonversi utf-8 ke bytes")
        let ascii = this.wordsToAscii(message)
        console.log("konversi berhasil")
        
        const blockM =[];
        for(let i = 0; i < ascii.length ;i++){
            // console.log("ascii : "+ ascii[i]+ " e : "+ this.e)
            let pangkat = bigInt(ascii[i]).pow(this.e)
            // console.log("perhitungan enkripsi indeks ke-"+ i + ' hasil pangkat : '+ pangkat)
            let temp = bigInt(pangkat).mod(this.n).valueOf();
            console.log("perhitungan enkripsi indeks ke-"+ i + ' : '+ temp)
            
            blockM[i] = temp;
        }

        const et = this.asciiToText(blockM)
        console.log("enkripsi berhasil!!!")
        return et
    }

    nilaiN(){
        return this.n;
    }

    asciiToText(ascii){
        const text = [];
        for(let i=0;i<ascii.length;i++){
            text[i] = String.fromCharCode(ascii[i])
        }

        let newText = ""
        for(let i = 0;i<text.length;i++){
            const temp = text[i].toString();
            newText = newText.concat(temp);
        }

        return newText;
    }

    decrpyt(s, d, n){
        console.log("menkonversi pesan ke bytes");
        let et = this.wordsToAscii(s);
        // console.log('ET : '+ et+'\nnilai d : '+d+'\nnilai n : '+ n)

        // arrayOfET = et;
        const tempDecrypt = []
        // cid mod n
        // d diganti menjadi 187
        // n diganti menjadi 319
        console.log("mendekripsi pesan")
        for(let i = 0;i<et.length;i++){
            console.log("menghitung indeks ke-"+ i)
            tempDecrypt[i] = bigInt(et[i]).pow(d).mod(n).valueOf()
            console.log("indeks ke-"+i + " berhasil dihitung")
        }
        console.log("menkonversi nilai bytes hasil dekripsi menjadi utf-8")
        const toTeks = this.asciiToText(tempDecrypt)
        console.log("berhasil mengkonversi nilai bytes ke teks")
        return toTeks
    }
}

module.exports = RSA;