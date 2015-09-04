/// <reference path="../../typings/tsd.d.ts" />

var should = require('should');
var SkuStream = require('../../lib/stream/skuStream');

describe('Optimise Iterations', function () {
    it('No rules iterations one greater than count', function (done) {
        var sc = {
        "attributes": [
            { "code": "alpha", "values": [{ "value": "A" }, { "value": "B" }, { "value": "C" }] },
            { "code": "beta", "values": [{ "value": "1" }, { "value": "2" }, { "value": "3" }] },
            { "code": "gamma", "values": [{ "value": "1" }, { "value": "2" }, { "value": "3" }] }
        ]};
            
        
        var readable = new SkuStream(sc);
        var count = 0;

        readable.on('data', function (possibleSku) {
            count++;
        });
        readable.on('end', function () {
            count.should.equal(27);
            done();
        });
    });

    it('Only 15 of the skus are valid we shouldnot get more callbacks', function (done) {
        var sc = {
        "attributes": [
            { "code": "alpha", "values": [{ "value": "A" }, { "value": "B" }, { "value": "C" }] },
            { "code": "beta", "values": [{ "value": "1" }, { "value": "2" }, { "value": "3" }] },
            { "code": "gamma", "values": [{ "value": "1" }, { "value": "2" }, { "value": "3" }] }
        ],
        "rules": [
            { when: ["alpha", "A"], then: ["beta", "1", "2"] },
            { when: ["alpha", "B"], then: ["beta", "2", "3"] },
            { when: ["alpha", "C"], then: ["beta", "3"] }
        ]};
            

        var readable = new SkuStream(sc);
        var count = 0;

        readable.on('data', function (possibleSku) {
            count++;
        });
        readable.on('end', function () {
            count.should.equal(15);
            done();
        });
    });
});
    