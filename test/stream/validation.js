/// <reference path="../../typings/tsd.d.ts" />
var should = require('should');
var SkuValidator = require('../../lib/stream/SkuValidator');
var pair = require('../../lib/stream/pair');

describe('Optimise Validation', function () {
    describe('Validation for Objects doesnt have to have the complet object', function () {
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
        
        it('ValidObjects', function () {
            var v = new SkuValidator(sc.rules,sc.attributes);
            
            //{ when: ["alpha", "A"], then: ["beta", "1", "2"] },
            v.isValidSku([0,0,0]).should.eql(true);
            v.isValidSku([0,1,0]).should.eql(true);
            
            //{ when: ["alpha", "B"], then: ["beta", "2", "3"] },                      
            v.isValidSku([1,1,0]).should.eql(true);
            v.isValidSku([1,2,0]).should.eql(true);
            
            //{ when: ["alpha", "C"], then: ["beta", "3"] }
            v.isValidSku([2,2,0]).should.eql(true);
        });
            
        it('InvalidObjects', function () {
            var v = new SkuValidator(sc.rules,sc.attributes);
            
            //{ when: ["alpha", "A"], then: ["beta", "1", "2"] },
            v.isValidSku([0,2,0]).should.eql(false);
            
            //{ when: ["alpha", "B"], then: ["beta", "2", "3"] },                      
            v.isValidSku([1,0,0]).should.eql(false);
            
            //{ when: ["alpha", "C"], then: ["beta", "3"] }
            v.isValidSku([2,0,0]).should.eql(false);
            v.isValidSku([2,1,0]).should.eql(false);
        });
    });
    
    describe('Validation Rules can invalid pairs', function () {
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
            
        it('Invalid Pairs', function () {
            var v = new SkuValidator(sc.rules,sc.attributes);
            var invalidPairs = v.invalidPairs(sc.rules,sc.attributes);
            
            var alphaArray = 0, betaArray=1; 
            var alphaA = 0, alphaB = 1,alphaC = 2; 
            var beta1 = 0, beta2 = 1,beta3 = 2;
                        
            // { when: ["alpha", "A"], then: ["beta", "1", "2"] },
            invalidPairs.should.containEql(pair.invalidPair(alphaArray, alphaA, betaArray, beta3));
            
            //{ when: ["alpha", "B"], then: ["beta", "2", "3"] },
            invalidPairs.should.containEql(pair.invalidPair(alphaArray, alphaB, betaArray, beta1));
            
            //{ when: ["alpha", "C"], then: ["beta", "3"] }
            invalidPairs.should.containEql(pair.invalidPair(alphaArray, alphaC, betaArray, beta1));
            invalidPairs.should.containEql(pair.invalidPair(alphaArray, alphaC, betaArray, beta2));
                
        });
    })
    
    describe('Validation helper methods', function () {
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
            
        it('findIndexOfAttribute', function () {
            var v = new SkuValidator(sc.rules,sc.attributes);
            v.findIndexOfAttribute(sc.attributes,"alpha").should.eql(0);
            v.findIndexOfAttribute(sc.attributes,"beta").should.eql(1);
            v.findIndexOfAttribute(sc.attributes,"gamma").should.eql(2); 
        });
        
        it('findIndexOfAttributeValues', function () {
            var v = new SkuValidator(sc.rules,sc.attributes);
            var alphaAttr = sc.attributes[0];
            //{ when: ["alpha", "A"], then: ["beta", "1", "2"] },
            v.findIndexOfAttributeValues(alphaAttr,sc.rules[0].when.slice(1)).should.eql([0]);
            
            //{ when: ["alpha", "B"], then: ["beta", "2", "3"] },
            v.findIndexOfAttributeValues(alphaAttr,sc.rules[1].when.slice(1)).should.eql([1]);
            
            //{ when: ["alpha", "C"], then: ["beta", "3"] }
            v.findIndexOfAttributeValues(alphaAttr,sc.rules[2].when.slice(1)).should.eql([2]);
        });
        
        it('findIndexOfOtherAttributeValues', function () {
            var v = new SkuValidator(sc.rules,sc.attributes);
            var betaAttr = sc.attributes[1];
            //{ when: ["alpha", "A"], then: ["beta", "1", "2"] },
            var b12 = sc.rules[0].then.slice(1);
            v.findIndexOfOtherAttributeValues(betaAttr, b12).should.eql([2]);
            
            //{ when: ["alpha", "B"], then: ["beta", "2", "3"] },
            var b23 = sc.rules[1].then.slice(1);
            v.findIndexOfOtherAttributeValues(betaAttr,b23).should.eql([0]);
            
            //{ when: ["alpha", "C"], then: ["beta", "3"] }
            var b3 =sc.rules[2].then.slice(1); 
            v.findIndexOfOtherAttributeValues(betaAttr,b3).should.eql([0,1]);
        });
        
    })
});