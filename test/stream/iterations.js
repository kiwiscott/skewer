/// <reference path="../../typings/tsd.d.ts" />

var should = require('should');
var SkuStream = require('../../lib/stream/skuStream');
var SkuValidator = require('../../lib/stream/SkuValidator');

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
    
    
    it('We can iterate to the next location when we know parents are invalid', function (done) {
        var sc = {
        "attributes": [
            { "code": "alpha", "values": [{ "value": "A" }, { "value": "B" }, { "value": "C" }, { "value": "D" }] },
            { "code": "beta", "values": [{ "value": "X" }, { "value": "Y" }, { "value": "Z" }] },
            { "code": "gamma", "values": [{ "value": "b" }, { "value": "c" }, { "value": "d" }, { "value": "e" }] },
            { "code": "delta", "values": [{ "value": "1" }, { "value": "2" }, { "value": "3" }] }
        ],
        "rules": [
            { when: ["alpha", "A"], then: ["beta", "X", "Y"] },
            { when: ["alpha", "B"], then: ["beta", "X"] },
            { when: ["alpha", "C"], then: ["beta", "Z"] }
        ]};
        
        var readable = new SkuStream(sc);
        var count = 0;

        readable.on('data', function (possibleSku) {
            count++;
        });
        readable.on('end', function () {
            console.log(readable.cycles);
            count.should.equal(84);
            readable.cycles.should.be.below(100);
            done();
        });    
    });

    it('An object can be invalid only when proven to be invalid', function () {
        var sc = {
        "attributes": [
            { "code": "alpha", "values": [{ "value": "A" }, { "value": "B" }, { "value": "C" }, { "value": "D" }] },
            { "code": "beta", "values": [{ "value": "X" }, { "value": "Y" }, { "value": "Z" }] },
            { "code": "gamma", "values": [{ "value": "b" }, { "value": "c" }, { "value": "d" }, { "value": "e" }] },
            { "code": "delta", "values": [{ "value": "1" }, { "value": "2" }, { "value": "3" }] }
        ],
        "rules": [
            { when: ["alpha", "A"], then: ["beta", "X", "Y"] },
            { when: ["alpha", "B"], then: ["beta", "X"] },
            { when: ["alpha", "C"], then: ["beta", "Z"] }
        ]};
        
        var AZb1 =[0,2,0,0];    
        var AZ =[0,2];    
        var A =[0];    
        
        var v = new SkuValidator(sc.rules,sc.attributes);
        v.isValidSku(AZb1).should.eql(false);
        v.isValidSku(AZ).should.eql(false);
        v.isValidSku(A).should.eql(true);
            
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
    