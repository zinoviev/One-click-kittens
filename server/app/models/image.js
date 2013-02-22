var mongoose = require('mongoose');

var imageSchema = mongoose.Schema({
    name : String,
    url : String
});

var Image = mongoose.model('Image', imageSchema);

module.exports = Image;
