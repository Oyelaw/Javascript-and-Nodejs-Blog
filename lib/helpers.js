/*
 *  Helper library for common tasks
 *
 */

 // Dependencies
 var crypto = require('crypto');
 var config = require('./config');

 // Container for module
 var helpers = {};

 // Create a SHA256 hash
 helpers.hash = function (str) {
   // sanity check passed argument
   if (typeof(str) == 'string' && str.length > 0) {
     var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
     return hash;
   } else {
     return false;
   }
 };

 // Parse a JSON string to an object in all cases without throwing
 helpers.parseJsonToObject = function(str) {
   try {
     var obj = JSON.parse(str);
     return obj;
   } catch(e) {
     return {};
   }
 };

 // Creat a string of random alphanumeric characters of a give length
 helpers.createRandomString =function(strLength) {
   strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
   if(strLength) {
     // Define all the possible characters that can go into a string
     var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz1234567890';

     // Start the final string
     var  str = '';
     for(i = 1; i <= strLength; i++) {
       var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
       str += randomCharacter;
     }

     return str;
   } else {
     return false;
   };
 }

 // Export the module
 module.exports = helpers;
