/*
 *  Class for handling HTTP requests using FETCH API
 *
 */

class HttpRequest {

  request(headers,path,method,queryStringObject,payload) {

    // Sanity check
    var headers = typeof(headers) == 'object' && headers !== null ? headers : {};
    var path = typeof(path) == 'string' ? path : '/';
    var method = typeof(method) == 'string' && ['POST','GET','PUT','DELETE'].indexOf(method.toUpperCase()) > -1 ? method.toUpperCase() : 'GET';
    var queryStringObject = typeof(queryStringObject) == 'object' && queryStringObject !== null ? queryStringObject : {};
    var payload = typeof(payload) == 'object' && payload !== null ? JSON.stringify(payload) : null;

    // For each query string parameter sent, add it to the path
    var requestUrl = path+'?';
    var counter = 0;
    for(var queryKey in queryStringObject){
       if(queryStringObject.hasOwnProperty(queryKey)){
         counter++;
         // If at least one query string parameter has already been added, preprend new ones with an ampersand
         if(counter > 1){
           requestUrl+='&';
         }
         // Add the key and value
         requestUrl+=queryKey+'='+queryStringObject[queryKey];
       }
    };

    var fHeaders = new Headers();

    fHeaders.append("Content-type", "application/json")
    for(var headerKey in headers){
       if(headers.hasOwnProperty(headerKey)){
         fHeaders.append(headerKey, headers[headerKey]);
       }
    };

    // if(app.config.sessionToken){
    //   fHeaders.append("token", app.config.sessionToken.id);
    // }
    //Send the Fetch request
         return new Promise((resolve, reject) => {
           fetch(requestUrl, {
             method: method,
             headers: fHeaders,
             body: payload
           })
           .then(res => res.json())
           .then(data => resolve(data))
           .catch(err => reject(err));
         });
  }

};
