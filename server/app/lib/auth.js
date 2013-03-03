var everyauth = require('everyauth'),
    User = require('../models/user');

everyauth.everymodule.findUserById( function (userId, callback) {
        User.findById(userId, callback);
})

//TODO don't store twitter meta in session
everyauth.twitter
  //.entryPath('/auth/twitter'),
  //.callbackPath('/auth/twitter/callback'),
  .consumerKey('79xKd40BUBolRVS8flcLw')
  .consumerSecret('MNj9NnVOM5MgqSfvpczGLfYQ1XBpxQuFHeD9BAp4Yi8')
  .findOrCreateUser( function (session, accessToken, accessTokenSecret, twitterUserMetadata) {
        var promise = this.Promise();
        User.authWithTwitter(twitterUserMetadata, function(err, user) {
            if (err) {
                promise.fulfill([err]);
            }
            else {
                promise.fulfill(user);
            }
        });
        return promise;
  })
  .redirectPath('/');