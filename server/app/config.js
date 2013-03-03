var path = require('path');
//TODO add env check
//NODE_ENV=production node app.js
// switch(process.env.NODE_ENV){
//        case 'development':

var config = {
    //base url for building links
    //baseUrl : 'http://cl.ug',
    baseUrl : 'http://zigi.kity.jit.su',
    //here will me images saved on disk
    imgDir : path.join(__dirname,'../tmp-images'),
    //Url returned to client
    imgPath : '/img',
    //mongo
    //mongoUrl : 'mongodb://localhost/images'
    mongoUrl : 'mongodb://nodejitsu_zigi:s476k3vsiu768hnolavbc2sql@ds043947.mongolab.com:43947/nodejitsu_zigi_nodejitsudb7446508812'
};

module.exports = config;
