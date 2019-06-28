/*
 *  handle route requests
 *
 */

// Dependencies
var _data = require('./data');
var helpers = require('./helpers');

// Define the module object
var routes = {};

// JSON API HANDLERS
// Users
routes.users = function (data, callback) {
  var acceptableMethods = ['post','get','put','delete'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    routes._users[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for user submethods
routes._users = {};

// Users - post
// Required fields: firstName, lastName, phone, email, password, tosAgreement
routes._users.post = function (data, callback) {
  // Check that all required fields are filled out
  var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
  var email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

  if(firstName && lastName && phone && email && password && tosAgreement){
    // Make sure the user doesnt already exist
    _data.read('users', email, function (err,data) {
      if (err) {
        // Hash the password
        var hashedPassword = helpers.hash(password);

        // Create the user object
        if(hashedPassword){
          var userObject = {
            'firstName' : firstName,
            'lastName' : lastName,
            'phone' : phone,
            'email': email,
            'hashedPassword' : hashedPassword,
            'tosAgreement' : true
          };

          // Store the user
          _data.create('users', email, userObject, function (err) {
            if (!err) {
              callback(200);
            } else {
              callback(500,{'Error' : 'Could not create the new user'});
            }
          });
        } else {
          callback(500,{'Error' : 'Could not hash the user\'s password.'});
        }

      } else {
        // User alread exists
        callback(400,{'Error' : 'A user with that email already exists'});
      }
    });

  } else {
    callback(400,{'Error' : 'Missing required fields'});
  }
};

// Users - get
// Required fields: email
// @TODO: add token verification for this route
routes._users.get = function (data, callback) {
// Check that the email is valid
var email = typeof(data.queryStringObject.email) == 'string' && data.queryStringObject.email.trim().length > 0 ? data.queryStringObject.email.trim() : false;
if (email) {
  // Lookup user
  _data.read('users', email, function (err, data) {
    if (!err && data) {
      delete data.hashedPassword;
      callback(200, data);
    } else {
      callback(404);
    }
  });
} else {
  callback(400, {'Error': 'Missing required field'});
}
};

// Users - put
// Required fields: email
// Optional fields: firstName, lastName, password
// @TODO: add token verificationfor this route
routes._users.put = function (data, callback) {
  // Check for required field
  var email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;

  // Check for optional fields
  var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;

  if (email) {
    if (firstName || lastName || password) {
      _data.read('users', email, function (err, userData) {
        if (!err && userData) {
          // Update the fields if necessary
          if (firstName) {
            userData.firstName = firstName;
          }
          if (lastName) {
            userData.lastName = lastName;
          }
          if (phone) {
            userData.phone = phone;
          }
          if (password) {
            userData.hashedPassword = helpers.hash(password);
          }

          // Store the new updates
          _data.update('users', email, userData, function (err){
            if (!err){
              callback(200);
            } else {
              callback(500, {'Error': 'Could not update the user'})
            }
          });
        } else {
          callback(400, {'Error': 'Specified user does not exist'});
        }
      });
    } else {
      callback(400, {'Error': 'Missing fields to update'});
    }
  } else {
    callback(400, {'Error': 'Missing required field'});
  }
};

// Users - delete
// Required fields: email
// @TODO: add token verification for this route
routes._users.delete = function (data, callback) {
  var email = typeof(data.queryStringObject.email) == 'string' && data.queryStringObject.email.trim().length > 0 ? data.queryStringObject.email.trim() : false;

  if (email) {
    _data.read('users', email, function (err, userData) {
      if (!err && userData) {
        _data.delete('users', email, function (err) {
          if (!err) {
            callback(200, {'Message': 'User deleted'});
          } else {
            callback(500, {'Error': 'Could not delete specified user'})
          }
        })
      }
    });
  } else {
    callback(400, {'Error': 'Missing required field'});
  }
};

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
