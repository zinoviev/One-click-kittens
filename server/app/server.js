var express = require('express'),
	fs = require('fs'),
	path = require('path'),
	app = express(),
    cons = require('consolidate'),
    config = require('./config'),
    files = require('./files'),
    mongoose = require('mongoose'),
    Image = require('./models/image');

//Serve public
app.use('/public',express.static(path.join(__dirname,'../public')));
app.use(config.imgPath, express.static( config.imgDir ));

//Setup views
app.engine('html', cons.handlebars);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

//Middleware
app.use(express.bodyParser());

//Routes
app.get('/test', function(req,res) {
	//res.sendfile('public/index.html');
    res.render('index.html');
});

app.get('/', function(req, res) {
    var result = 'What we have:<br/>';

    Image.find(function(err, images) {
        images.forEach(function(el, index){
            result += '<a href="' + el.url + '">' + el.name + "</a><br/>"
        });

        res.send(result);
    });
})

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

});

//Errors
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something broke!');
});

app.use(function(req, res, next){
  res.send(404, 'Sorry cant find that!');
});

//Init mongo
mongoose.connect(config.mongoUrl);
app.listen(3000);

module.exports = app;