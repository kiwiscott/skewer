/// <reference path="../../typings/tsd.d.ts" />

var should = require('should');
var SkuStream = require('../../lib/stream/skuStream');

describe('Sku Stream Basics', function () {
       
    describe('Should act as we expect a stream too', function () {
        var sc = {
            "attributes": [
                { "code": "alpha", "values": [{ "value": "A" }, { "value": "B" }, { "value": "C" }] },
                { "code": "beta", "values": [{ "value": "1" }, { "value": "2" }, { "value": "3" }] },
                { "code": "gamma", "values": [{ "value": "1" }, { "value": "2" }, { "value": "3" }] }
            ]};
            
        it('Stream should work', function (done) {
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
    });

    describe('Permutation At Index', function () {
        var sc = {
            "attributes": [
                { "code": "alpha", "values": [{ "value": "A" }, { "value": "B" }, { "value": "C" }] },
                { "code": "beta", "values": [{ "value": "1" }, { "value": "2" }, { "value": "3" }] },
                { "code": "theta", "values": [{ "value": "X" }, { "value": "Y" }, { "value": "Z" }] }
            ],
            "rules": [
                { when: ["alpha", "A"], then: ["beta", "1", "2"] },
                { when: ["alpha", "B"], then: ["beta", "2", "3"] },
                { when: ["alpha", "C"], then: ["beta", "3"] }
            ]};
            
            it('Less than 0 should be null', function () {
            var validSkus = new SkuStream(sc);
            should(validSkus.permutationAtIndex(-1)).be.null;
            should(validSkus.permutationAtIndex(-100)).be.null;
        });

        it('Equal to of greater than length should be null', function () {
            var validSkus = new SkuStream(sc);
            should(validSkus.permutationAtIndex(27)).be.null;
            should(validSkus.permutationAtIndex(2700)).be.null;
        });

        it('Should be able to get an index array for the item by index', function () {
            var validSkus = new SkuStream(sc);
            validSkus.permutationArrayAtIndex(0).should.eql([ 0, 0, 0 ]);
            validSkus.permutationArrayAtIndex(1).should.eql([ 0, 0, 1 ]);
            validSkus.permutationArrayAtIndex(2).should.eql([ 0, 0, 2 ]);
            validSkus.permutationArrayAtIndex(3).should.eql([ 0, 1, 0 ]);
            validSkus.permutationArrayAtIndex(4).should.eql([ 0, 1, 1 ]);
            validSkus.permutationArrayAtIndex(5).should.eql([ 0, 1, 2 ]);
            validSkus.permutationArrayAtIndex(6).should.eql([ 0, 2, 0 ]);
            validSkus.permutationArrayAtIndex(7).should.eql([ 0, 2, 1 ]);
            validSkus.permutationArrayAtIndex(8).should.eql([ 0, 2, 2 ]);

            validSkus.permutationArrayAtIndex(09).should.eql([ 1, 0, 0 ]);
            validSkus.permutationArrayAtIndex(10).should.eql([ 1, 0, 1 ]);
            validSkus.permutationArrayAtIndex(11).should.eql([ 1, 0, 2 ]);
            validSkus.permutationArrayAtIndex(12).should.eql([ 1, 1, 0 ]);
            validSkus.permutationArrayAtIndex(13).should.eql([ 1, 1, 1 ]);
            validSkus.permutationArrayAtIndex(14).should.eql([ 1, 1, 2 ]);
            validSkus.permutationArrayAtIndex(15).should.eql([ 1, 2, 0 ]);
            validSkus.permutationArrayAtIndex(16).should.eql([ 1, 2, 1 ]);
            validSkus.permutationArrayAtIndex(17).should.eql([ 1, 2, 2 ]);

            validSkus.permutationArrayAtIndex(18).should.eql([ 2, 0, 0 ]);
            validSkus.permutationArrayAtIndex(19).should.eql([ 2, 0, 1 ]);
            validSkus.permutationArrayAtIndex(20).should.eql([ 2, 0, 2 ]);
            validSkus.permutationArrayAtIndex(21).should.eql([ 2, 1, 0 ]);
            validSkus.permutationArrayAtIndex(22).should.eql([ 2, 1, 1 ]);
            validSkus.permutationArrayAtIndex(23).should.eql([ 2, 1, 2 ]);
            validSkus.permutationArrayAtIndex(24).should.eql([ 2, 2, 0 ]);
            validSkus.permutationArrayAtIndex(25).should.eql([ 2, 2, 1 ]);
            validSkus.permutationArrayAtIndex(26).should.eql([ 2, 2, 2 ]);
        });
        
/***
 * 0    A1X  
 * 1    A1Y
 * 2    A1Z 
 * 
 * 
 * 
*** */

/*
* 0 A1X = valid
* 1 A1Y = valid
* 2 A1Z = valid
* 3 A2X = valid
* 4 A2Y = valid
* 5 A2Z = valid
* 6 A3X = invalid
* 7 A3Y = invalid
* 8 A3Z = invalid

* 09 B1X = invalid
* 10 B1Y = invalid
* 11 B1Z = invalid
* 12 B2X = valid
* 13 B2Y = valid
* 14 B2Z = valid
* 15 B3X = valid
* 16 B3Y = valid
* 17 B3Z = valid

* 18 C1X = invalid
* 19 C1Y = invalid
* 20 C1Z = invalid
* 21 C2X = invalid
* 22 C2Y = invalid
* 23 C2Z = invalid
* 24 C3X = valid
* 25 C3Y = valid
* 26 C3Z = valid
*/
        it('isValidPermutationArray', function () {
            var v = new SkuStream(sc);
            v.isValidPermutationArray(v.permutationArrayAtIndex(0)).should.eql(true);
            v.isValidPermutationArray(v.permutationArrayAtIndex(1)).should.eql(true);
            v.isValidPermutationArray(v.permutationArrayAtIndex(2)).should.eql(true);
            v.isValidPermutationArray(v.permutationArrayAtIndex(3)).should.eql(true);
            v.isValidPermutationArray(v.permutationArrayAtIndex(4)).should.eql(true);
            v.isValidPermutationArray(v.permutationArrayAtIndex(5)).should.eql(true);
            v.isValidPermutationArray(v.permutationArrayAtIndex(6)).should.eql(false);
            v.isValidPermutationArray(v.permutationArrayAtIndex(7)).should.eql(false);
            v.isValidPermutationArray(v.permutationArrayAtIndex(8)).should.eql(false);
            
            v.isValidPermutationArray(v.permutationArrayAtIndex(09)).should.eql(false);
            v.isValidPermutationArray(v.permutationArrayAtIndex(10)).should.eql(false);
            v.isValidPermutationArray(v.permutationArrayAtIndex(11)).should.eql(false);
            v.isValidPermutationArray(v.permutationArrayAtIndex(12)).should.eql(true);
            v.isValidPermutationArray(v.permutationArrayAtIndex(13)).should.eql(true);
            v.isValidPermutationArray(v.permutationArrayAtIndex(14)).should.eql(true);
            v.isValidPermutationArray(v.permutationArrayAtIndex(15)).should.eql(true);
            v.isValidPermutationArray(v.permutationArrayAtIndex(16)).should.eql(true);
            v.isValidPermutationArray(v.permutationArrayAtIndex(17)).should.eql(true);
            
            v.isValidPermutationArray(v.permutationArrayAtIndex(18)).should.eql(false);
            v.isValidPermutationArray(v.permutationArrayAtIndex(19)).should.eql(false);            
            v.isValidPermutationArray(v.permutationArrayAtIndex(20)).should.eql(false);
            v.isValidPermutationArray(v.permutationArrayAtIndex(21)).should.eql(false);
            v.isValidPermutationArray(v.permutationArrayAtIndex(22)).should.eql(false);
            v.isValidPermutationArray(v.permutationArrayAtIndex(23)).should.eql(false);
            v.isValidPermutationArray(v.permutationArrayAtIndex(24)).should.eql(true);
            v.isValidPermutationArray(v.permutationArrayAtIndex(25)).should.eql(true);
            v.isValidPermutationArray(v.permutationArrayAtIndex(26)).should.eql(true);
        });
        
        
        it('Should be able to get item by index', function () {
            var validSkus = new SkuStream(sc);
            validSkus.permutationAtIndex(0).should.eql({ "alpha": "A", "beta": "1", "theta": "X" });
            validSkus.permutationAtIndex(1).should.eql({ "alpha": "A", "beta": "1", "theta": "Y" });
            validSkus.permutationAtIndex(2).should.eql({ "alpha": "A", "beta": "1", "theta": "Z" });
            validSkus.permutationAtIndex(3).should.eql({ "alpha": "A", "beta": "2", "theta": "X" });
            validSkus.permutationAtIndex(4).should.eql({ "alpha": "A", "beta": "2", "theta": "Y" });
            validSkus.permutationAtIndex(5).should.eql({ "alpha": "A", "beta": "2", "theta": "Z" });
            validSkus.permutationAtIndex(6).should.eql({ "alpha": "A", "beta": "3", "theta": "X" });
            validSkus.permutationAtIndex(7).should.eql({ "alpha": "A", "beta": "3", "theta": "Y" });
            validSkus.permutationAtIndex(8).should.eql({ "alpha": "A", "beta": "3", "theta": "Z" });

            validSkus.permutationAtIndex(09).should.eql({ "alpha": "B", "beta": "1", "theta": "X" });
            validSkus.permutationAtIndex(10).should.eql({ "alpha": "B", "beta": "1", "theta": "Y" });
            validSkus.permutationAtIndex(11).should.eql({ "alpha": "B", "beta": "1", "theta": "Z" });
            validSkus.permutationAtIndex(12).should.eql({ "alpha": "B", "beta": "2", "theta": "X" });
            validSkus.permutationAtIndex(13).should.eql({ "alpha": "B", "beta": "2", "theta": "Y" });
            validSkus.permutationAtIndex(14).should.eql({ "alpha": "B", "beta": "2", "theta": "Z" });
            validSkus.permutationAtIndex(15).should.eql({ "alpha": "B", "beta": "3", "theta": "X" });
            validSkus.permutationAtIndex(16).should.eql({ "alpha": "B", "beta": "3", "theta": "Y" });
            validSkus.permutationAtIndex(17).should.eql({ "alpha": "B", "beta": "3", "theta": "Z" });

            validSkus.permutationAtIndex(18).should.eql({ "alpha": "C", "beta": "1", "theta": "X" });
            validSkus.permutationAtIndex(19).should.eql({ "alpha": "C", "beta": "1", "theta": "Y" });
            validSkus.permutationAtIndex(20).should.eql({ "alpha": "C", "beta": "1", "theta": "Z" });
            validSkus.permutationAtIndex(21).should.eql({ "alpha": "C", "beta": "2", "theta": "X" });
            validSkus.permutationAtIndex(22).should.eql({ "alpha": "C", "beta": "2", "theta": "Y" });
            validSkus.permutationAtIndex(23).should.eql({ "alpha": "C", "beta": "2", "theta": "Z" });
            validSkus.permutationAtIndex(24).should.eql({ "alpha": "C", "beta": "3", "theta": "X" });
            validSkus.permutationAtIndex(25).should.eql({ "alpha": "C", "beta": "3", "theta": "Y" });
            validSkus.permutationAtIndex(26).should.eql({ "alpha": "C", "beta": "3", "theta": "Z" });
        });
    });
});



