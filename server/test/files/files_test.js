var files = require('../../app/lib/files'),
    fs = require('fs'),
    gm = require('gm'),
    path = require('path');


var dir = path.join(__dirname, 'img');

exports['Images processing test'] = {

    setUp: function(done) {
        done();
    },
    
    'Create thumb': function(test) {
        var buf = fs.readFileSync(path.join(dir,'big-picture.jpeg'));
        files.saveThumb(buf, path.join(dir,'image-thumb.jpeg'), function(err, path){
            test.ifError(err);
            test.notEqual(path, null);
            test.done();
        });
    }
};