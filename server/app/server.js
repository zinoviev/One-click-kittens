var express = require('express'),
	fs = require('fs'),
	path = require('path'),
	app = express(),
    cons = require('consolidate'),
    config = require('./config'),
    mongoose = require('mongoose'),
    everyauth = require('everyauth'),
    auth = require('./lib/auth'),
    boot = require('./lib/boot');

//Serve public
app.use('/public',express.static(path.join(__dirname,'../public')));
app.use(config.imgPath, express.static( config.imgDir ));

//Setup views
app.engine('html', cons.handlebars);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

//Middleware
app.use(express.bodyParser());
app.use(express.cookieParser());
//TODO add betta session support
app.use(express.session({ secret : 'whoooa'}));
app.use(everyauth.middleware());

//Controllers
boot.loadControllers(path.join(__dirname, '/controllers'),app);

//Errors
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, err.stack);
});

app.use(function(req, res, next){
  res.send(404, 'Sorry cant find that!');
});

//Init mongo
mongoose.connect(config.mongoUrl);
app.listen(80);

module.exports = app;