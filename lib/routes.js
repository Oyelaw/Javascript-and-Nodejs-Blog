/*
 *  handle route requests
 *
 */

// Dependencies
var _data = require('./data');
var helpers = require('./helpers');

// Define the module object
var routes = {};

// HTML API ROUTES
// Index
routes.index = function (data, callback) {
  if (data.method == 'get') {

    var templateData = {
      'head.title': 'Javascript and Node Blog',
      'head.description': 'Javascript and Node JS',
      'main.class': 'index'
    }

    helpers.getTemplate('index', templateData, function (err, str) {
      if (!err && str) {

        // Add header and footer
        helpers.addHeaderAndFooterTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html')
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// View Post
routes.postView = function (data, callback) {
  if (data.method == 'get') {
    var templateData = {
      'head.title': 'View Post',
      'main.class': 'postView'
    }

    helpers.getTemplate('postView', templateData, function (err, str) {
      if (!err && str) {
        helpers.addHeaderAndFooterTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        })
      } else {
        callback(500, undefined, 'html');
      }
    })
  } else {
    callback(405, undefined, 'html');
  }
};

// Create New Session
routes.adminLogin = function (data,callback) {
  // Reject any request that isn't a GET
  if(data.method == 'get'){
    // Prepare data for interpolation
    var templateData = {
      'head.title' : 'Login to your account.',
      'head.description' : 'Please enter your email and password to access your account.',
      'main.class' : 'adminLogin'
    };
    // Read in a template as a string
    helpers.getTemplate('adminLogin', templateData, function (err,str) {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addHeaderAndFooterTemplates(str, templateData, function (err,str) {
          if (!err && str) {
            // Return that page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Dashboard
routes.adminDashboard = function (data,callback) {
  // Reject any request that isn't a GET
  if (data.method == 'get') {
    // Prepare data for interpolation
    var templateData = {
      'head.title' : 'Dashboard.',
      'head.description' : 'You can view blog stats and create new posts from here.',
      'main.class' : 'adminDashboard'
    };
    // Read in a template as a string
    helpers.getTemplate('adminDashboard', templateData, function (err,str) {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addHeaderAndFooterTemplates(str, templateData, function (err,str) {
          if (!err && str) {
            // Return that page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Session has been deleted
routes.sessionDeleted = function (data,callback) {
  // Reject any request that isn't a GET
  if (data.method == 'get') {
    // Prepare data for interpolation
    var templateData = {
      'head.title' : 'Logged Out',
      'head.description' : 'You have been logged out of your account.',
      'body.class' : 'sessionDeleted'
    };
    // Read in a template as a string
    helpers.getTemplate('sessionDeleted', templateData, function (err,str) {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addHeaderAndFooterTemplates(str, templateData, function (err,str) {
          if (!err && str) {
            // Return that page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Create Account
routes.accountCreate = function (data,callback) {
  // Reject any request that isn't a GET
  if (data.method == 'get') {
    // Prepare data for interpolation
    var templateData = {
      'head.title' : 'Create an Account',
      'head.description' : 'Signup is easy and only takes a few seconds.',
      'main.class' : 'accountCreate'
    };
    // Read in a template as a string
    helpers.getTemplate('accountCreate', templateData, function (err,str) {
      if(!err && str){
        // Add the universal header and footer
        helpers.addHeaderAndFooterTemplates(str, templateData, function (err,str) {
          if(!err && str){
            // Return that page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Public assets
routes.public = function (data,callback) {
  // Reject any request that isn't a GET
  if (data.method == 'get') {
    // Get the filename being requested
    var trimmedAssetName = data.trimmedPath.replace('public/','').trim();
    if(trimmedAssetName.length > 0){
      // Read in the asset's data
      helpers.getStaticAsset(trimmedAssetName,function (err,data) {
        if (!err && data) {

          // Determine the content type (default to plain text)
          var contentType = 'plain';

          if (trimmedAssetName.indexOf('.css') > -1) {
            contentType = 'css';
          }

          if (trimmedAssetName.indexOf('.png') > -1) {
            contentType = 'png';
          }

          if (trimmedAssetName.indexOf('.jpg') > -1) {
            contentType = 'jpg';
          }

          if (trimmedAssetName.indexOf('.ico') > -1) {
            contentType = 'favicon';
          }

          callback(200,data,contentType);
        } else {
          callback(404);
        }
      });
    } else {
      callback(404);
    }
  } else {
    callback(405);
  }
};


// JSON API ROUTES
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
            'tosAgreement' : tosAgreement
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

// Tokens
routes.tokens = function (data, callback) {
  var acceptableMethods = ['post','get','put','delete'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    routes._tokens[data.method](data, callback);
  } else {
    callback(405);
  }
};

routes._tokens = {};

// Tokens - post
routes._tokens.post = function (data,callback) {
  var email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

  console.log('EMAIL AND Password', email, password);
  console.log('EMAIL AND Password', data.payload.email, data.payload.password);
  if (email && password) {
    // Lookup the user who matches that phone number
    _data.read('users',email,function (err,userData) {
      if (!err && userData) {
        // Hash the sent password, and compare it to the password stored in the user object
        var hashedPassword = helpers.hash(password);
        if(hashedPassword == userData.hashedPassword){
          // If valid, create a new token with a random name. Set an expiration date 1 hour in the future.
          var tokenId = helpers.createRandomString(20);
          var expires = Date.now() + 1000 * 60 * 60;
          var tokenObject = {
            'email' : email,
            'id' : tokenId,
            'expires' : expires
          };

          // Store the token
          _data.create('tokens',tokenId,tokenObject,function (err) {
            if (!err) {
              callback(200,tokenObject);
            } else {
              callback(500,{'Error' : 'Could not create the new token'});
            }
          });
        } else {
          callback(400,{'Error' : 'Password did not match the specified user\'s stored password'});
        }
      } else {
        callback(400,{'Error' : 'Could not find the specified user.'});
      }
    });
  } else {
    callback(400,{'Error' : 'Missing required field(s).'})
  }
};

// Tokens - get
routes._tokens.get = function (data,callback) {
  // Check that id is valid
  var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
  if (id) {
    // Lookup the token
    _data.read('tokens',id,function (err,tokenData) {
      if (!err && tokenData) {
        callback(200,tokenData);
      } else {
        callback(404);
      }
    });
  } else {
    callback(400,{'Error' : 'Missing required field, or field invalid'})
  }
};

// Tokens - put
routes._tokens.put = function (data,callback) {
  var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
  var extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;

  if (id && extend) {
    // Lookup the existing token
    _data.read('tokens',id,function (err,tokenData) {
      if (!err && tokenData) {
        // Check to make sure the token isn't already expired
        if (tokenData.expires > Date.now()) {
          // Set the expiration an hour from now
          tokenData.expires = Date.now() + 1000 * 60 * 60;
          // Store the new updates
          _data.update('tokens',id,tokenData,function (err){
            if (!err) {
              callback(200);
            } else {
              callback(500,{'Error' : 'Could not update the token\'s expiration.'});
            }
          });
        } else {
          callback(400,{"Error" : "The token has already expired, and cannot be extended."});
        }
      } else {
        callback(400,{'Error' : 'Specified user does not exist.'});
      }
    });
  } else {
    callback(400,{"Error": "Missing required field(s) or field(s) are invalid."});
  }
};

// Tokens - delete
routes._tokens.delete = function (data,callback) {
  // Check that id is valid
  var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
  if(id){
    // Lookup the token
    _data.read('tokens',id,function (err,tokenData) {
      if(!err && tokenData){
        // Delete the token
        _data.delete('tokens',id,function (err) {
          if(!err){
            callback(200);
          } else {
            callback(500,{'Error' : 'Could not delete the specified token'});
          }
        });
      } else {
        callback(400,{'Error' : 'Could not find the specified token.'});
      }
    });
  } else {
    callback(400,{'Error' : 'Missing required field'})
  }
};

// Verify if token is valid
routes._tokens.verifyToken = function (id,email,callback) {
  // Lookup the token
  _data.read('tokens', id, function (err,tokenData) {
    if (!err && tokenData) {
      // Check that the token is for the given user and has not expired
      if (tokenData.email == email && tokenData.expires > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

// Post
routes.post = function (data,callback) {
  var acceptableMethods = ['post','get','put','delete'];
  if(acceptableMethods.indexOf(data.method) > -1){
    routes._post[data.method](data,callback);
  } else {
    callback(405);
  }
};

routes._post = {};

// Post - post
routes._post.post = function (data, callback) {
  // Sanity check the data
  var title = typeof(data.payload.title) == 'string' && data.payload.title.trim().length > 0 ? data.payload.title : false;
  var article = typeof(data.payload.article) == 'string' && data.payload.article.trim().length > 0 ? data.payload.article : false;
  var images = typeof(data.payload.images) == 'object' && data.payload.images instanceof Array ? data.payload.images : [];

  if (title && article && images) {
    // Get token from the header
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

    _data.read('tokens', token, function (err, tokenData) {
      if (!err && tokenData) {
        var postId = helpers.createRandomString(20);
        var imageId = helpers.createRandomString(20);
        var created = Date.now();

        // Post Object
        var postObject = {
          'id': postId,
          'title': title,
          'article': article,
          'images': images,
          'created': created
        };

        _data.create('posts', postId, postObject, function (err) {
          if(!err){
            callback(200, postObject);
          } else {
            callback(400, {'Error': 'Could not save post'});
          }
        });
      } else {
        callback(403);
      }
    });
  } else {
    callback(400, {'Error': 'Missing required fields, Could not create post'});
  }
};

// Post - get
routes._post.get = function (data, callback) {
  // Get the ID
  var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;

  if (id) {
    _data.read('posts', id, function (err, postData) {
      if(!err && postData){
        callback(200, postData);
      } else {
        callback(400, {'Error': 'Could not open post, it may not exist'});
      }
    });
  } else {
    callback(400, {'Error': 'Missing required field'});
  }
};

// Post - put
routes._post.put = function (data, callback) {
  // check paylaod
  var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;

  // optional fields
  var title = typeof(data.payload.title) == 'string' && data.payload.title.trim().length > 0 ? data.payload.title : false;
  var article = typeof(data.payload.article) == 'string' && data.payload.article.trim().length > 0 ? data.payload.article : false;
  var images = typeof(data.payload.images) == 'object' && data.payload.images instanceof Array ? data.payload.images : false;

  if (id) {
    if (title || article || images) {
      _data.read('posts', id, function (err, postData) {
        if (!err && postData) {
          if (title) {
            postData.title = title;
          }

          if (article) {
            postData.article = article;
          }

          if (images) {
            postData.images = images;
          }

          // Updated time stamp
          postData.updated = Date.now();

          // Save the changes to the post
          _data.update('posts', id, postData, function (err) {
            if (!err) {
              callback(200, postData);
            } else {
              callback(400, {'Error': 'Could not update file'});
            }
          });

        } else {
          callback(400, {'Error': 'Could not open post for update'});
        }
      });
    } else {
      callback(400, {'Error': 'Could not find fields to update'});
    }
  } else {
    callback(400, {'Error': 'Missing required field'});
  }
};

// Post - delete
routes._post.delete = function (data, callback) {
  var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;

  if (id) {
    _data.delete('posts', id, function (err) {
      if (!err) {
        callback(200);
      } else {
        callback(400, {'Error': 'Unable to delete post'});
      }
    });
  } else {
    callback(400, {'Error': 'Missing required field'});
  }
};

// Route to gather all posts
routes.posts = function (data, callback) {
  var acceptableMethods = ['post', 'get', 'put', 'delete'];
  var method = data.method.toLowerCase();
  if (acceptableMethods.indexOf(method) > -1) {
    routes._posts[method](data, callback);
  } else {
    callback(405);
  }
};

routes._posts = {};

// Get all posts
routes._posts.get = function (data, callback) {
  _data.list('posts', function (err, postsList) {
    if (!err && postsList) {
      callback(200, postsList);
    } else {
      callback(400, {'Error': 'Could not find posts'})
    }
  });
};


// Ping route
routes.ping = function (data, callback){
  callback(200);
};

// Not found route
routes.notFound = function (data, callback){
  callback(404);
};

// Export the routes module
module.exports = routes;
