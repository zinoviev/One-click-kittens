var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name : String,
    fullName : String,
    auth : {
        twitter : {
            id : Number,
            name : String,
            fullName : String
        }
    }
});

userSchema.statics.authWithTwitter = function(twitterUserMetadata,cb) {
    User.findOne({'auth.twitter.id' : twitterUserMetadata.id}, function(err, result) {
        if (err) {
            cb(err);
        }
        else if ( result ) {
            cb(null, result);
        }
        else {
            var newUser = new User({
                fullName : twitterUserMetadata.name,
                name : twitterUserMetadata.screen_name
            });
            newUser.auth = {
                twitter : {
                    id : twitterUserMetadata.id,
                    name : twitterUserMetadata.screen_name
                }
            }

            newUser.save(function(err) {
                cb(null, newUser);
            })
        }

    })
};

var User = mongoose.model('User', userSchema);

module.exports = User;