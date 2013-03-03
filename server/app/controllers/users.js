var Image = require('../models/image'),
    User = require('../models/user'),
    async = require('async');

var controller = {
    route : '/users/:name',

    get : function(req,res) {

        async.waterfall([
            function fetchUser(cb) {
                User.findOne({name : req.param('name')}, function(err,user){
                    if (user) {
                        cb(err, user);
                    }
                    else {
                        cb('Not found');
                    }
                })
            },
            function fetchImages(user,cb) {
                Image.find({ userId: user.id}, function(err,images) {
                    cb(err,images);
                })
            }
        ], function(err, images){
            if (err) {
                res.redirect('/');
            }
            else
            {
                res.render('users.html', { username : req.param('name'), images : images});
            }
        });
    }

};

module.exports = controller;
