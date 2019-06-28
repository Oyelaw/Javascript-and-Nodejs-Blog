/*
 * Entry point for Application
 *
 */

 // Dependencies
 var server = require('./lib/server');

 // Declare app module
 var app = {};

 // Initialise app
 app.init = function () {
   // Start the server
   server.init();
 };

 // Start the app
 app.init();

 // Export the app module
 module.exports = app;
