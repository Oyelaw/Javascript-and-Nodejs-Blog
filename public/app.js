var httpRequest = new HttpRequest;
var ui = new UI;

var { createNode, addToClasslist, append } = ui;

var app = {};

// Config
app.config = {
  'sessionToken': false
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
            console.log('Error: ', err);
          })
      })
    })
    .catch(function (err) {
      console.log('Error: ', err);
    });
};

// Load data on page
app.loadDataOnPage = function () {
  // Get the current page from the main class
  var mainClasses = document.querySelector("main").classList;
  var primaryClass = typeof(mainClasses[0]) == 'string' ? mainClasses[0] : false;

  if(primaryClass == 'index'){
    app.loadIndexPage();
  }
};

app.init = function () {
  app.loadDataOnPage();
};

window.onload = function(){
  app.init();
};
