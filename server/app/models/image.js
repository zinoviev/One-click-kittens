var mongoose = require('mongoose');

var imageSchema = mongoose.Schema({
    name : String,
    url : String,
    fullPath : String,
    thumbPath : String
});

var Image = mongoose.model('Image', imageSchema);

module.exports = Image;
