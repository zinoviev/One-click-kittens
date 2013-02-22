var path = require('path');

var config = {
    //base url for building links
    baseUrl : 'http://localhost:3000/',
    //here will me images saved on disk
    imgDir : path.join(__dirname,'../tmp-images'),
    //Url returned to client
    imgPath : '/img'
};

module.exports = config;
