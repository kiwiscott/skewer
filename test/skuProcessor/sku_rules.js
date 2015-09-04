/// <reference path="../../typings/tsd.d.ts" />

var should = require('should');
var skuProcessor = require('../../lib/skuProcessor');
var log = require('log4js').getLogger("skurulestest");

describe('Calculate Sku Variations', function () {
     var sc = {
            "attributes": [
                { "code": "alpha", "values": [{ "value": "A" }, { "value": "B" }, { "value": "C" }] },
                { "code": "numeric", "values": [{ "value": "1" }, { "value": "2" }, { "value": "3" }] }
            ],
            "rules": [
                { when: ["alpha", "A"], then: ["numeric", "1", "2"] },
                { when: ["alpha", "B"], then: ["numeric", "2", "3"] },
                { when: ["alpha", "C"], then: ["numeric", "3"] }
            ]};
                       

    it('Rules should filter unwanted options', function (done) {
        skuProcessor.processValidSkus(sc, function (validSkus) {
            log.debug('skus : ' + JSON.stringify(validSkus));

            var skuCount = 5;
            validSkus.length.should.equal(skuCount);
            done();
        });
    });

    it('Sku Matches should be', function (done) {
        skuProcessor.processValidSkus(sc, function (validSkus) {
            var expected = [{ alpha: 'A', numeric: '1' },
                { alpha: 'A', numeric: '2' },
                { alpha: 'B', numeric: '2' },
                { alpha: 'B', numeric: '3' },
                { alpha: 'C', numeric: '3' }];

            for (var i = 0; i < expected.length; i++) {
                validSkus.should.containEql(expected[i]);
            }
            done();
        });
    });
});

