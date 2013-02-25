var boot = require('../../app/lib/boot.js'),
    fs = require('fs'),
    request = require('supertest'),
    path = require('path'),
    express = require('express');

/*
 ======== A Handy Little Nodeunit Reference ========
 https://github.com/caolan/nodeunit

 Test methods:
 test.expect(numAssertions)
 test.done()
 Test assertions:
 test.ok(value, [message])
 test.equal(actual, expected, [message])
 test.notEqual(actual, expected, [message])
 test.deepEqual(actual, expected, [message])
 test.notDeepEqual(actual, expected, [message])
 test.strictEqual(actual, expected, [message])
 test.notStrictEqual(actual, expected, [message])
 test.throws(block, [error], [message])
 test.doesNotThrow(block, [error], [message])
 test.ifError(value)
 */

var dir = path.join(__dirname, 'controllers');
var app = express();

exports['Controller bootstraper test'] = {

    setUp: function(done) {
        done();
    },
    'test with http result': function(test) {

    boot.loadControllers(dir,app);
    request(app)
        .get('/test')
        .expect(200, 'Yep')
        .end(function(err,res) {
            test.ifError(err);
            test.done();
    });



    }
};