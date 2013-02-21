var express = require('express'),
	fs = require('fs'),
	path = require('path'),
	app = express(),
    files = require('./files');

var tmpPath = path.join(__dirname,'../tmp-images');

//Serve public
app.use(express.static('public'));

//Middleware
app.use(express.bodyParser());

//Routes
app.get('/', function(req,res) {
	res.sendFile('public/index.html');
});

app.post('/', function(req, res) {
    var uploadMethod = req.body.uploadMethod;

    if (uploadMethod) {
        if (uploadMethod == 'download') {

            if (req.body.url) {
                files.download(req.body.url, function(err){
                    if (err) {
                        res.status(500).send(err);
                    }
                    else {
                        res.redirect('/');
                    }
                });
            }
        }
        else if (uploadMethod == 'base64') {
            if (req.body.filename && req.body.filedata) {
                var buf = new Buffer(req.body.filedata, 'base64');
                files.save(buf, path.join(tmpPath,req.body.filename), function(err) {
                    if (err) {
                        res.status(500).send(err);
                    }
                    else {
                        res.redirect('/');
                    }
                });
            }
            else {
                res.status(500).send('No required params')
            }
        } else {
            res.status(500).send('No required params')
        }
    }
    else {
        res.status(500).send('No required params')
    }

});

app.listen(3000);

module.exports = app;