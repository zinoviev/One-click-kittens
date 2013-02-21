var fs = require('fs'),
    mime = require('mime'),
    http = require('http'),
    request = require('request'),
    uuid = require('node-uuid'),
    path = require('path');

var tmpPath = path.join(__dirname,'../tmp-images');
var allowedFiles = ['png', 'jpg', 'jpeg', 'gif', 'jpe'];

function createPath(ext) {
    return path.join( tmpPath, uuid.v4() + '.' + ext);
}

function save(data, path, callback) {
    fs.writeFile(path, data, function(err) {
        if (err) {
            callback(err);
        }
        else {
            callback();
        }
    });
}

function download(url, callback) {

    request.get({ url : url, encoding : null}, function(reqError, response, body){
        var error;
        //oops we don't have net access
        if (reqError) {
            error = new Error(url + ' Can not connect ');
        }
        else {
            //Do we have healthy server response?
            if (response.statusCode == '200' ||
                response.statusCode == '304')
            {
                var cType = response.headers['content-type'],
                ext = cType ? mime.extension(cType) : null;

                if ( allowedFiles.indexOf( ext) >= 0  ) {
                    save(body, createPath(ext), callback);
                }
                else {
                    error = new Error(url + ' Content type not supported: ' + cType);
                }
            }
            else {
                error = new Error(url + ' HTTP status code is invalid: ' + response.statusCode );
            }
        }

        if (error) {
            callback(error);
        }
    });
}

//request.get('http://upload.wikimedia.org/wikipedia/commons/3/30/Googlelogo.png').pipe(fs.createWriteStream(createPath('png')));
//'http://nodejs.org/images/logo.png'
//http://img-fotki.yandex.ru/get/5632/198748971.0/0_aedaf_73409b31_L
//for (var i =0; i<5; i++) {
//download('http://img-fotki.yandex.ru/get/5632/198748971.0/0_aedaf_73409b31_L', function(err, result) {
//    if (err) {
//        console.log(err);
//    }
//    else {
//        console.log(result);
//    }
//});
//}
//console.log('ok');

module.exports.save = save;
module.exports.download = download;