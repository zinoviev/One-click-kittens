var fs = require('fs'),
    path = require('path');

function loadControllers(dir, app) {
    fs.readdirSync(dir).forEach(function(name){
        var obj = require(path.join(dir,name)),
            predefinedProps = ['route'];

        if (!obj.route) {
            throw new Error('Passed controller without route');
        }

        Object.keys(obj).forEach(function(verb){
            if (predefinedProps.indexOf(verb) == -1) {

                if (!app[verb]) {
                    throw new Error('Unknown verb method');
                }
                else {
                    app[verb].call(app,obj.route, obj[verb]);
                }
                
            }
        })

    });
};

exports.loadControllers = loadControllers;
