var express = require('express'),
	fs = require('fs'),
	path = require('path'),
	app = express();

var tmpPath = path.join(__dirname,'tmp-images');

//Serve public
app.use(express.static('public'));

//Middleware
app.use(express.bodyParser());

//Routes
app.get('/', function(req,res) {
	res.sendFile('public/index.html');
});

app.post('/', function(req, res) {
	if (req.body.filename && req.body.filedata) {
		var buf = new Buffer(req.body.filedata, 'base64');
		fs.writeFileSync(path.join(tmpPath,req.body.filename), buf);	
	}
	else {
		
	}

	res.redirect('/');
});

//Start
app.listen(3000);
console.log('Server is working fine');