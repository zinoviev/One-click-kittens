var mongoose = require('mongoose'),
    config = require('../config'),
    path = require('path'),
    uuid = require('node-uuid');

var imageSchema = mongoose.Schema({
    name : String,
    filename : String,
    thumbname : String,
    type : String,
    userId : mongoose.Schema.Types.ObjectId,
    fullPath : String,
    thumbPath : String
});

imageSchema.virtual('url').get(function() {
    return config.baseUrl + config.imgPath + '/' + this.filename;
});

imageSchema.virtual('thumbUrl').get(function() {
    return config.baseUrl + config.imgPath + '/' + this.thumbname;
});

imageSchema.methods.initRandoms = function() {
    if (this.type == null) {
        throw new Error('Type is not defined');
    }
    this.filename = randomName(this.type);
    this.thumbname = randomName(this.type);
    this.fullPath = createPath(this.filename);
    this.thumbPath = createPath(this.thumbname);
}

function randomName(type) {
    return filename = uuid.v4() + '.' + type;
};

function createPath(filename) {
    return path.join( config.imgDir , filename);
}

var Image = mongoose.model('Image', imageSchema);

module.exports = Image;
