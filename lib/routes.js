/*
 *  handle route requests
 *
 */

// Dependencies


// Define the module object
var routes = {};



// Ping route
routes.ping = function(data, callback){
  callback(200);
};

// Not found route
routes.notFound = function(data, callback){
  callback(404);
};

// Export the routes module
module.exports = routes;
