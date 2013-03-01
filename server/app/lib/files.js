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

function saveThumb(buffer, path, callback) {
    //TODO add check for gifs
    gm(buffer).thumb(THUMB_SIZE, THUMB_SIZE, path, 100, function(err){
        callback(err,path);
    })
}

function save(buffer, path , callback) {

    fs.writeFile(path, buffer, function(err) {
        if (err) {
            callback(err);
        }
        else {
            callback(null, path);
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
                    callback(null, body, ext);
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
module.exports.createThumb = saveThumb;