var express = require('express'),
	fs = require('fs'),
	path = require('path'),
	app = express(),
    config = require('./config'),
    files = require('./files');

//Serve public
app.use(express.static('public'));
app.use(config.imgPath, express.static( config.imgDir ));

//Middleware
app.use(express.bodyParser());

//Routes
app.get('/', function(req,res) {
	res.sendFile('public/index.html');
});

app.post('/', function(req, res) {
    var uploadMethod = req.body ? req.body.uploadMethod : null,
        uploadCallback = function(err, filename) {
            if (err) {
                res.status(500).send({
                    success : false,
                    error : err
                });
            }
            else {
                res.status(201).send({
                    success : true,
                    url : config.imgPath + '/' + filename
                });
            }
        };

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

});

//Errors
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something broke!');
});

app.use(function(req, res, next){
  res.send(404, 'Sorry cant find that!');
});

app.listen(3000);

module.exports = app;