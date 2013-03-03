var Image = require('../models/image'),
    User = require('../models/user'),
    config = require('../config'),
    async = require('async'),
    files = require('../lib/files.js');

function sendResponse(res, err, model) {
    if (err) {
        res.status(500).send({
            success : false,
            error : err
        });
    }
    res.status(201).send({
        success : true,
        url : model.url
    });
}

function processImage(imageBuf, model, callback) {
    //Create random names and setup paths
    model.initRandoms();
    async.waterfall([
        function saveToDisk(cb) {
            files.save(imageBuf, model.fullPath, function(err) {
                cb(err);
            })
        },
        function createThumb(cb) {
            files.createThumb(imageBuf, model.thumbPath, function(err) {
                cb(err);
            })
        },
        function createModel(cb) {
            model.save(function(err) {
                cb(err);
            })
        }
    ], function(err) {
        callback(err, model);
    })
}


var controller = {
    route : '/',

    get : function(req, res) {
        Image.find().limit(30).exec(function(err, images) {
            res.render('index.html', { user : req.user, images : images});
        });
    },

    post : function(req, res) {
        var uploadMethod = req.body ? req.body.uploadMethod : null,
            imageName = req.body.name ? req.body.name : 'Unknown image',
            url = req.body.url,
            data = req.body.data,
            extension = req.body.extension,
            buf = null,
            user = req.user,
            imageModel = new Image({
                name : imageName
            });

        if (!user) {
            res.status(401).send();
            return;
        }
        else {
            imageModel.userId = user.id;
        }


        if (uploadMethod == 'download' && url) {
            files.download(url, function onDownload(err, buf, ext) {
                    imageModel.type = ext;
                    processImage(buf, imageModel, function(err, model) {
                        sendResponse(res, err, model);
                    });
            });
        }
        else if (uploadMethod == 'base64' && data && extension) {
            buf = new Buffer(data, 'base64');
            imageModel.type = extension;

            processImage(buf, imageModel, function(err, model) {
                sendResponse(res, err, model);
            });

        }
        else {
            res.status(500).send('No required params')
        }
    }

};

module.exports = controller;