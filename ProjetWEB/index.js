const http = require('http');
const api= require('./api');
const files= require('./files');



http.createServer(function(request, response) {
    let a=request.url.split('/');
    if (request.url.includes('..')){
        response.statusCode=404;
        response.end("Wrong directory");
    }
    
    
    if(a[1]=="api"){ return api.manage(request, response);}
    return files.manage(request, response);

}).listen(8000,"0.0.0.0",function(){ console.log("it works");});
