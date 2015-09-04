/// <reference path="../../typings/tsd.d.ts" />

var should = require('should');
var SkuStream = require('../../lib/stream/skuStream');

describe('Sku Stream Basics', function () {
    var attributes = [
        { "code": "alpha", "values": [{ "value": "A" }, { "value": "B" }, { "value": "C" }] },
        { "code": "numeric", "values": [{ "value": "1" }, { "value": "2" }, { "value": "3" }] },
        { "code": "theta", "values": [{ "value": "X" }, { "value": "Y" }, { "value": "Z" }] }
    ];

    describe('Should act as we expect a stream too', function () {
        it('Stream should work', function (done) {
            var readable = new SkuStream(attributes);
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
        it('Less than 0 should be null', function () {
            var validSkus = new SkuStream(attributes);
            should(validSkus.permutationAtIndex(-1)).be.null;
            should(validSkus.permutationAtIndex(-100)).be.null;
        });

        it('Equal to of greater than length should be null', function () {
            var validSkus = new SkuStream(attributes);
            should(validSkus.permutationAtIndex(27)).be.null;
            should(validSkus.permutationAtIndex(2700)).be.null;
        });

        it('Should be able to get item by index', function () {
            var validSkus = new SkuStream(attributes);
            validSkus.permutationAtIndex(0).should.eql({ "alpha": "A", "numeric": "1", "theta": "X" });
            validSkus.permutationAtIndex(1).should.eql({ "alpha": "A", "numeric": "1", "theta": "Y" });
            validSkus.permutationAtIndex(2).should.eql({ "alpha": "A", "numeric": "1", "theta": "Z" });
            validSkus.permutationAtIndex(3).should.eql({ "alpha": "A", "numeric": "2", "theta": "X" });
            validSkus.permutationAtIndex(4).should.eql({ "alpha": "A", "numeric": "2", "theta": "Y" });
            validSkus.permutationAtIndex(5).should.eql({ "alpha": "A", "numeric": "2", "theta": "Z" });
            validSkus.permutationAtIndex(6).should.eql({ "alpha": "A", "numeric": "3", "theta": "X" });
            validSkus.permutationAtIndex(7).should.eql({ "alpha": "A", "numeric": "3", "theta": "Y" });
            validSkus.permutationAtIndex(8).should.eql({ "alpha": "A", "numeric": "3", "theta": "Z" });

            validSkus.permutationAtIndex(09).should.eql({ "alpha": "B", "numeric": "1", "theta": "X" });
            validSkus.permutationAtIndex(10).should.eql({ "alpha": "B", "numeric": "1", "theta": "Y" });
            validSkus.permutationAtIndex(11).should.eql({ "alpha": "B", "numeric": "1", "theta": "Z" });
            validSkus.permutationAtIndex(12).should.eql({ "alpha": "B", "numeric": "2", "theta": "X" });
            validSkus.permutationAtIndex(13).should.eql({ "alpha": "B", "numeric": "2", "theta": "Y" });
            validSkus.permutationAtIndex(14).should.eql({ "alpha": "B", "numeric": "2", "theta": "Z" });
            validSkus.permutationAtIndex(15).should.eql({ "alpha": "B", "numeric": "3", "theta": "X" });
            validSkus.permutationAtIndex(16).should.eql({ "alpha": "B", "numeric": "3", "theta": "Y" });
            validSkus.permutationAtIndex(17).should.eql({ "alpha": "B", "numeric": "3", "theta": "Z" });

            validSkus.permutationAtIndex(18).should.eql({ "alpha": "C", "numeric": "1", "theta": "X" });
            validSkus.permutationAtIndex(19).should.eql({ "alpha": "C", "numeric": "1", "theta": "Y" });
            validSkus.permutationAtIndex(20).should.eql({ "alpha": "C", "numeric": "1", "theta": "Z" });
            validSkus.permutationAtIndex(21).should.eql({ "alpha": "C", "numeric": "2", "theta": "X" });
            validSkus.permutationAtIndex(22).should.eql({ "alpha": "C", "numeric": "2", "theta": "Y" });
            validSkus.permutationAtIndex(23).should.eql({ "alpha": "C", "numeric": "2", "theta": "Z" });
            validSkus.permutationAtIndex(24).should.eql({ "alpha": "C", "numeric": "3", "theta": "X" });
            validSkus.permutationAtIndex(25).should.eql({ "alpha": "C", "numeric": "3", "theta": "Y" });
            validSkus.permutationAtIndex(26).should.eql({ "alpha": "C", "numeric": "3", "theta": "Z" });
        });
    });
});



