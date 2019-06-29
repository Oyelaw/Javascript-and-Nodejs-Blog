// Dependencies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var path = require('path');
var util = require('util');
var debug = util.debuglog('server');
var routes = require('./routes');
var config = require('./config');
var helpers = require('./helpers');

// Instantiate Server Modd=ule Object
var server = {};

// Instantiate HTTP server
server.httpServer = http.createServer(function (req, res) {
  // Get the URL and parse it
  var parsedUrl = url.parse(req.url, true);

  // Get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string object
  var queryStringObject = parsedUrl.query;

  // Get the HTTP method
  var method = req.method.toLowerCase();

  // Get the headers
  var headers = req.headers;

  // Get the payload
  var decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data', function (data) {
    buffer += decoder.write(data);
  });
  req.on('end', function () {
    buffer += decoder.end();

    // Choose the route this request should go to, default to not-fund route if undefined
    var chosenRoute = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : routes.notFound;

    chosenRoute = trimmedPath.indexOf('public/') > -1 ? routes.public : chosenRoute;

    // Data object to send to the handler
    var data = {
      'trimmedPath': trimmedPath,
      'queryStringObject': queryStringObject,
      'method': method,
      'headers': headers,
      'payload': helpers.parseJsonToObject(buffer)
    };

    // Route request to handler specified
    try {
      chosenRoute(data, function (statusCode, payload, contentType) {
        server.processRouteResponse(res, method, trimmedPath, statusCode, payload, contentType);
      });
    } catch(e) {
      debug(e)
      server.processRouteResponse(res, method, trimmedPath, 500, {'Error': 'An unknown error has occured'}, 'json');
    }
  });
});

// Process the response from the route
server.processRouteResponse = function (res, method, trimmedPath, statusCode, payload, contentType) {
  // Determine the type of response
  contentType = typeof(contentType) == 'string' ? contentType : 'json';

  statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

  var payloadString = '';
  if(contentType == 'json') {
    res.setHeader('Content-Type', 'application/json');
    payload = typeof(payload) == 'object' ? payload : {};
    payloadString = JSON.stringify(payload);
  }
  if(contentType == 'html') {
    res.setHeader('Content-Type', 'text/html');
    payloadString = typeof(payload) =='string' ? payload : '';
  }
  if(contentType == 'favicon') {
    res.setHeader('Content-Type', 'image/x-icon');
    payloadString = typeof(payload) !=='undefined' ? payload : '';
  }
  if(contentType == 'css') {
    res.setHeader('Content-Type', 'text/css');
    payloadString = typeof(payload) !=='undefined' ? payload : '';
  }
  if(contentType == 'png') {
    res.setHeader('Content-Type', 'image/png');
    payloadString = typeof(payload) !=='undefined' ? payload : '';
  }
  if(contentType == 'jpg') {
    res.setHeader('Content-Type', 'image/jpeg');
    payloadString = typeof(payload) !=='undefined' ? payload : '';
  }
  if(contentType == 'plain') {
    res.setHeader('Content-Type', 'text/plain');
    payloadString = typeof(payload) !=='undefined' ? payload : '';
  }

  res.writeHead(statusCode);
  res.end(payloadString);

  if(statusCode == 200) {
    debug('\x1b[32m%s\x1b[0m', method.toUpperCase()+' /'+trimmedPath+' '+statusCode);
  } else {
    debug('\x1b[31m%s\x1b[0m', method.toUpperCase()+' /'+trimmedPath+' '+statusCode);
  }
};

// Router
server.router = {
  '': routes.index,
  'post/view': routes.postView,
  'admin/login': routes.adminLogin,
  'ping': routes.ping,
  'api/users': routes.users,
  'api/tokens': routes.tokens,
  'api/post': routes.post,
  'api/posts': routes.posts,
  'public': routes.public
};

server.init = function () {
  // Start the HTTP server
  server.httpServer.listen(config.httpPort, function () {
    console.log('\x1b[36m%s\x1b[0m', `httpServer listening on ${config.httpPort}`);
  });
};

// Export the module
module.exports = server;
