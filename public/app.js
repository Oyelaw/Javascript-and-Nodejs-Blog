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
        console.log('Error: ', err);
      })

  } else {
    alert('Where do I go??')
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
};

app.init = function () {
  app.loadDataOnPage();
};

window.onload = function(){
  app.init();
};
