const url = require('url');
const path= require('path');
const fs= require('fs');

const frontPath= "./front";
const htmlFileName= "index.html";

const mimeTypes = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.md': 'text/plain',
    'default': 'application/octet-stream'
};




function manageRequest(request, response) {
    response.statusCode = 200;
    let parsedURL=url.parse(request.url);



    let pathName= frontPath+url.parse(request.url).pathname;
    if(pathName.includes("..")){
        response.end("Error");
    }

    fs.exists(pathName,function(exist){
        if(exist){


            fs.readFile(pathName,function(error,data){
                if(!error){
                    response.setHeader(`Content-Type`,mimeTypes[path.extname(pathName)]);
                    response.end(data);

                }
                else{
                    response.statusCode = 400;
                    response.end(`An error occured`);
                }
            })
        }
        else{
            response.statusCode = 404;
            response.end(`html 404 Not Found.`);
        }
    })


   
}

exports.manage = manageRequest;