var fs = require('fs'),
    mime = require('mime'),
    http = require('http'),
    request = require('request'),
    uuid = require('node-uuid'),
    path = require('path'),
    gm = require('gm'),
    config = require('../config.js');

var allowedFiles = ['png', 'jpg', 'jpeg', 'gif', 'jpe'],
    THUMB_SIZE=200;

function createPath(ext) {
    var filename = uuid.v4() + '.' + ext;
    return {
        path: path.join( config.imgDir , filename),
        filename : filename
    };
}

function createThumb(buffer, ext, callback) {
    var path = createPath(ext);
    gm(buffer).thumb(THUMB_SIZE, THUMB_SIZE, 70, function(err){
        if (err) {
            callback(err);
        }
        else {
            callback(err, path);
        }
    })
}

function save(buffer, extension, callback) {
    var pathObj = createPath(extension);

    fs.writeFile(pathObj.path, buffer, function(err) {
        if (err) {
            callback(err);
        }
        else {
            callback(null, pathObj.filename);
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
                    save(body, ext, callback);
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

module.exports.save = save;
module.exports.download = download;
module.exports.createPath = createPath;
module.exports.createThumb = createThumb;