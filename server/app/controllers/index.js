var Image = require('../models/image'),
    config = require('../config'),
    files = require('../lib/files.js');

var controller = {
    route : '/',

    get : function(req, res) {
        Image.find(function(err, images) {
            res.render('index.html', { images : images});
        });
    },

    post : function(req, res) {
        var uploadMethod = req.body ? req.body.uploadMethod : null,
            uploadCallback = function(err, filename) {
                if (err) {
                    res.status(500).send({
                        success : false,
                        error : err
                    });
                }
                else {
                    var imageModel = new Image({
                        name : imageName,
                        url : config.baseUrl + config.imgPath + '/' + filename
                    });

                    imageModel.save(function(err) {
                        res.status(201).send({
                            success : true,
                            url : config.baseUrl + config.imgPath + '/' + filename
                        });
                    });
                }
            };

        var imageName = req.body.name ? req.body.name : 'Unknown image';

        if (uploadMethod == 'download' && req.body.url) {
            files.download(req.body.url, uploadCallback);
        }
        else if (uploadMethod == 'base64' && req.body.data
            && req.body.extension) {
            var buf = new Buffer(req.body.data, 'base64');
            files.save(buf, req.body.extension, uploadCallback);
        }
        else {
            res.status(500).send('No required params')
        }
    }

};

module.exports = controller;