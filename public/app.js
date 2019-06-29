/*
 *  Frontend Application Logic
 *
 */

// Required classes
var httpRequest = new HttpRequest;
var ui = new UI;

var { createNode, addToClasslist, append } = ui;

var app = {};

// Config
app.config = {
  'sessionToken': false
};

// Bind the logout button
app.bindLogoutButton = function () {
  var logoutButton = document.getElementById('logoutButton');

  if (logoutButton != null) {
    logoutButton.addEventListener('click', function (e) {

      e.preventDefault();

      // Log user out
      app.logUserOut();
    })
  }
};

// Log user out then redirect them
app.logUserOut = function (redirectUser) {

  // Set redirectUser to default to true
  redirectUser = typeof(redirectUser) == 'boolean' ? redirectUser : true;

  // Get the current token id
  var tokenId = typeof(app.config.sessionToken.id) == 'string' ? app.config.sessionToken.id : false;

  var queryStringObject = {
    'id' : tokenId
  };

  httpRequest.request(undefined, 'api/tokens', 'DELETE', queryStringObject, undefined)
    .then(function (response) {
      app.setSessionToken(false);
      if (redirectUser) {
        window.location = '/session/deleted';
      }
    })
    .catch(function (err) {
      console.log(`Error logging out. Error: ${err}`);
    })
};

// Set the session token in the app.config object as well as localstorage
app.setSessionToken = function(token){
  app.config.sessionToken = token;
  var tokenString = JSON.stringify(token);
  localStorage.setItem('token',tokenString);
};

// Get the session token from localstorage and set it in the app.config object
app.getSessionToken = function () {
  var tokenString = localStorage.getItem('token');
  if (typeof(tokenString) == 'string') {
    try {
      var token = JSON.parse(tokenString);
      app.config.sessionToken = token;
    } catch(e) {
      app.config.sessionToken = false;
      console.log(`Error getting token. Error: ${err}`);
    }
  }
};

// Bind Admin Login form
app.bindLoginForm = function () {
  var loginForm = document.getElementById('adminLogin');

  if (loginForm != null) {
    loginForm.addEventListener('submit', function (e) {

      e.preventDefault();
      var formId = this.id;
      var path = this.action;
      var method = this.method.toUpperCase();
      //Get the email and password
      var email = document.getElementById('email').value;
      var password = document.getElementById('password').value;

      if (email == '' || password == '') {
        // Show form error to enter required fields
        ui.showAlert('Enter required fields', 'formError alert')
      } else {
        var payload = {
          email: email,
          password: password
        };
        httpRequest.request(undefined, 'api/tokens', 'POST', undefined, payload)
          .then(function (response) {
            app.formResponseProcessor(formId, payload, response);
          })
          .catch(function (err) {
            console.log(`Error logging in. Error: ${err}`);
          })
      }
    });
  }
};

app.bindCreatePostForm = function () {
  var email = typeof(app.config.sessionToken.email) == 'string' ? app.config.sessionToken.email : false;

  if (email) {

      var createPostForm = document.getElementById('createPost');

      if (createPostForm != null) {
        createPostForm.addEventListener('submit', function (e) {

          e.preventDefault();
          var formId = this.id;
          var path = this.action;
          var method = this.method.toUpperCase();

          //Get the title, body and pictures
          var postTitle = document.getElementById('postTitle').value;
          var postBody = document.getElementById('postBody').value;
          var postPictures = document.getElementById('postPictures').value;

          if (postTitle == '' || postBody == '') {
            // show alert
            ui.showAlert('Enter required fields', 'formError alert');
          } else {
            // Parse images to array
            var parsedImages = postPictures ? JSON.parse(postPictures) : '';

            var payload = {
              title: postTitle,
              article: postBody,
              images: parsedImages
            };

            var headers = {
              "token" : app.config.sessionToken.id
            };

            httpRequest.request(headers, 'api/post', 'POST', undefined, payload)
              .then(function (response) {
                app.formResponseProcessor(formId, payload, response);
              })
              .catch(function (err) {
                console.log(`Error creating post. Error: ${err}`);
              })
          }
        });
      }
  } else {
    app.logUserOut()
  }
};

// Process response from forms
app.formResponseProcessor = function (formId, requestPayload, responsePayload) {

  if (formId == 'adminLogin') {
    app.setSessionToken(responsePayload);
    window.location = '/admin/dashboard';
  }

  if (formId == 'createPost') {
    ui.showAlert('Post created!!!', 'formSuccess alert');
    ui.clearPostCreateForm();
  }
};

app.loadIndexPage = function () {
  // Grab all post ids
  httpRequest.request(undefined, 'api/posts', 'GET', undefined, undefined)
    .then(function (postIds) {
      postIds.forEach(function (postId, i) {
        var queryStringObject = {
          id: postId
        };

      // Fetch post by Id
      httpRequest.request(undefined, 'api/post', 'GET', queryStringObject, undefined)
        .then(function (post) {
          var container = document.querySelector('.articles');
          var postDiv = createNode('div');
          var postThumbnail = createNode('img');
          var titleDiv = createNode('div');
          var titleParagraph = createNode('p');
          var linkTag = createNode('a');

          linkTag.href = `post/view?id=${post.id}`;

          addToClasslist(postDiv, 'post');
          addToClasslist(titleDiv, 'titlesIndex');

          var { images } = post;
          if (images.length > 0 && images[0].src) {
            postThumbnail.src = images[0].src;
            postThumbnail.alt = 'ArticlesImage';
          };

          var titleTextNode = document.createTextNode(post.title);
          append(titleParagraph, titleTextNode);
          append(titleDiv, titleParagraph);
          append(linkTag, postThumbnail);
          append(linkTag, titleDiv);
          append(postDiv, linkTag);
          append(container, postDiv);
        })
        .catch(function (err) {
          console.log(`Error Fetching post. Error: ${err}`);
        })
      })
    })
    .catch(function (err) {
      console.log(`Error Fetching all posts. Error: ${err}`);
    });
};

// Load Post view Page
app.loadPostViewPage = function () {
  // // Grab Post Id from window location
  var id = typeof(window.location.href.split('=')[1]) == 'string' && window.location.href.split('=')[1].length > 0 ? window.location.href.split('=')[1] : false;

  if (id) {
    var queryStringObject = {
      'id': id
    };

    httpRequest.request(undefined, 'api/post', 'GET', queryStringObject, undefined)
      .then(function (responsePayload) {
        var { title, article, images } = responsePayload;

        var leftPaneContent = document.querySelector('.left-pane-content');
        var rightPaneContent = document.querySelector('.right-pane-content');

        // Create Image Tags
        var mainImage = createNode('img');
        var extraImage1 = createNode('img');
        var extraImage2 = createNode('img');
        var extraImage3 = createNode('img');
        var extraImage4 = createNode('img');

        // Assign classes to images
        addToClasslist(mainImage, 'postImage');
        addToClasslist(extraImage1, 'postImage-extra');
        addToClasslist(extraImage2, 'postImage-extra');
        addToClasslist(extraImage3, 'postImage-extra');
        addToClasslist(extraImage4, 'postImage-extra');

        var articleParagraph = createNode('p');
        var articleTextNode = document.createTextNode(article);

        addToClasslist(articleParagraph, 'article');

        append(articleParagraph, articleTextNode);

        var postImages = {};
        // create helper function for below
        postImages.images = typeof(responsePayload.images) == 'object' && responsePayload.images instanceof Array ? responsePayload.images : [];
        postImages.images[0] ? mainImage.src = postImages.images[0].src : mainImage.style.display = 'none' ;
        postImages.images[1] ? extraImage1.src = postImages.images[1].src : extraImage1.style.display = 'none' ;
        postImages.images[2] ? extraImage2.src  = postImages.images[2].src : extraImage2.style.display = 'none' ;
        postImages.images[3] ? extraImage3.src = postImages.images[3].src : extraImage3.style.display = 'none' ;
        postImages.images[4] ? extraImage4.src = postImages.images[4].src : extraImage4.style.display = 'none' ;

        append(leftPaneContent, mainImage);
        append(leftPaneContent, articleParagraph);
        append(leftPaneContent, extraImage1);
        append(leftPaneContent, extraImage2);
        append(leftPaneContent, extraImage3);
        append(leftPaneContent, extraImage4);
      })
      .catch(function (err) {
        console.log(`Error loading post. Error: ${err}`);
        window.location = '/';
      })

  } else {
    console.log(`Error loading post. Error: ${err}`);
    window.location = '/';
  }
}

// Load data on page
app.loadDataOnPage = function () {
  // Get the current page from the main class
  var mainClasses = document.querySelector("main").classList;
  var primaryClass = typeof(mainClasses[0]) == 'string' ? mainClasses[0] : false;

  if(primaryClass == 'index'){
    app.loadIndexPage();
  }

  if(primaryClass == 'postView'){
    app.loadPostViewPage();
  }

  if(primaryClass == 'adminDashboard'){
    app.bindCreatePostForm();
  }

};

app.init = function () {
  app.getSessionToken();

  app.loadDataOnPage();

  app.bindLoginForm();

  app.bindLogoutButton();
};

window.onload = function(){
  app.init();
};
