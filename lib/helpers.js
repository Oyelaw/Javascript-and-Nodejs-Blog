/*
 *  Helper library for common reoccuring tasks
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

 // Export the module
 module.exports = helpers;
