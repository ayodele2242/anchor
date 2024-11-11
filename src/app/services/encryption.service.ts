import { Injectable } from '@angular/core';
import { StorageService } from '../services/storage.service';
import * as CryptoJS from 'crypto-js';
import { Buffer } from 'buffer';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  crypto: any;
  key:any;
  iv:any;
  private secretKey: string = environment.decryptionKey;
  encryptedText!: string;
  decryptedText!: string;
  
  constructor(private storage: StorageService) { }

  base64_decode(data: string) {
    // Decode the base64-encoded data here and return it as a string
    return data;
  }

 //The set method is use for encrypt the value.
 encrypt(key: string, iv: any, value: string){
  const encrypted = CryptoJS.AES.encrypt(value, key, { iv: iv });
  const encryptedMessage = encrypted.toString();
  return encryptedMessage;
}

//The get method is use for decrypt the value.
decrypt(value: string | CryptoJS.lib.CipherParams, keys: string | CryptoJS.lib.WordArray, ivs: any){   
// Decrypt the message
const decryptedMessage = CryptoJS.AES.decrypt(value, keys, { iv: ivs }).toString(CryptoJS.enc.Utf8);
return decryptedMessage;
}

base64Decrypt(jsonStr: string, passphrase: string) {
  var jsonStr = jsonStr;
  var passphrase = passphrase;
  var json = JSON.parse(jsonStr);
  
  var ciphertext = btoa("Salted__" + CryptoJS.enc.Hex.parse(json.s).toString(CryptoJS.enc.Latin1) + atob(json.ct)); // convert to OpenSSL format
  var decryptedData = CryptoJS.AES.decrypt(ciphertext, passphrase).toString(CryptoJS.enc.Utf8);    // decrypt and UTF-8 decode
  var decryptedDataJSON = JSON.parse(decryptedData);   // convert to JavaScript object                                                                             
  return decryptedDataJSON;
  }


openssl_decrypt(data: string, method: string, key: string, raw: boolean, iv: string) {
// @ts-ignore
return crypto.subtle.decrypt({name: method, iv: iv}, key, data).then((decrypted) => {
  return raw ? decrypted : this.bin2string(new Uint8Array(decrypted));
});
}






bin2string(array: Uint8Array) {
let result = "";
for (let i = 0; i < array.length; i++) {
  result += String.fromCharCode(array[i]);
}
return result;
}


makeRandom(lengthOfCode: number, possible: string) {
let text = "";
for (let i = 0; i < lengthOfCode; i++) {
  text += possible.charAt(Math.floor(Math.random() * possible.length));
}
  return text;
}


 

getEncryptionKey() {
return this.storage.getStorage("key").then((value: any) => value);
}

getEncryptionIV() {
return this.storage.getStorage("iv").then((value: any) => value);
}




}

