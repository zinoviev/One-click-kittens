var path = require('path');

var config = {
    //base url for building links
    baseUrl : 'http://localhost:3000',
    //baseUrl : 'http://zigi.kity.jit.su',
    //here will me images saved on disk
    imgDir : path.join(__dirname,'../tmp-images'),
    //Url returned to client
    imgPath : '/img',
    //mongo
    mongoUrl : 'mongodb://localhost/images',
    //mongoUrl : 'mongodb://nodejitsu_zigi:kv880ugbqr3meoeeimvk2kjk11@ds049537.mongolab.com:49537/nodejitsu_zigi_nodejitsudb3408506130'
};

module.exports = config;
