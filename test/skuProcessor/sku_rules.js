/// <reference path="../../typings/tsd.d.ts" />

var should = require('should');
var skuProcessor = require('../../lib/skuProcessor');

describe('Cannot Be Same Rule', function () {
     var sc = {
            "attributes": [
                { "code": "alpha", "values": [{ "value": "A" }, { "value": "B" }, { "value": "C" }] },
                { "code": "numeric", "values": [{ "value": "A" }, { "value": "B" }, { "value": "C" }] }
            ],
            "descriptor" : "function(sku){return 'Coolio ' + sku.alpha;}",
            "rules": [
                { cannotBeSame: ["alpha", "numeric"] }
            ]};
                       

    it('Rules should filter same options out', function (done) {
        skuProcessor.processValidSkus(sc, function (validSkus) {
            var skuCount = 6;
            validSkus.length.should.equal(skuCount);
            done();
        });
    });

    it('Sku Matches should be', function (done) {
        skuProcessor.processValidSkus(sc, function (validSkus) {
            var expected = [
                { alpha: 'A', description:'Coolio A', numeric: 'B' },
                { alpha: 'A', description:'Coolio A', numeric: 'C' },
                { alpha: 'B', description:'Coolio B', numeric: 'A' },
                { alpha: 'B', description:'Coolio B', numeric: 'C' },
                { alpha: 'C', description:'Coolio C', numeric: 'A' },
                { alpha: 'C', description:'Coolio C', numeric: 'B' }];

            for (var i = 0; i < expected.length; i++) {
                validSkus.should.containEql(expected[i]);
            }
            done();
        });
    });
});

describe('Calculate Sku Variations', function () {
     var sc = {
            "attributes": [
                { "code": "alpha", "values": [{ "value": "A" }, { "value": "B" }, { "value": "C" }] },
                { "code": "numeric", "values": [{ "value": "1" }, { "value": "2" }, { "value": "3" }] }
            ],
            "descriptor" : "function(sku){return sku.alpha + '-' + sku.numeric;}",
            "rules": [
                { when: ["alpha", "A"], then: ["numeric", "1", "2"] },
                { when: ["alpha", "B"], then: ["numeric", "2", "3"] },
                { when: ["alpha", "C"], then: ["numeric", "3"] }
            ]};         

    it('Rules should filter unwanted options', function (done) {
        skuProcessor.processValidSkus(sc, function (validSkus) {
          
            var skuCount = 5;
            validSkus.length.should.equal(skuCount);
            done();
        });
    });

    it('Sku Matches should be', function (done) {
        skuProcessor.processValidSkus(sc, function (validSkus) {
            var expected = [
                { alpha: 'A', description:'A-1',  numeric: '1' },
                { alpha: 'A', description:'A-2',  numeric: '2' },
                { alpha: 'B', description:'B-2',  numeric: '2' },
                { alpha: 'B', description:'B-3',  numeric: '3' },
                { alpha: 'C', description:'C-3',  numeric: '3' }];

            for (var i = 0; i < expected.length; i++) {
                validSkus.should.containEql(expected[i]);
            }
            done();
        });
    });
});