/// <reference path="../../typings/tsd.d.ts" />
var should = require('should');
var sku = require('../../lib/skuProcessor');
var fs = require('fs');


describe('Sku Variations', function () {
  describe('Apply Default Rules', function () {

    it('Rules should filter unwanted options', function (done) {
      var skuSample = JSON.parse(fs.readFileSync('./test/skuProcessor/sku.json','utf8'));
      
      sku.processValidSkus(skuSample, function (validSkus, err) {
        var skuCount = 254772;
        validSkus.length.should.equal(skuCount);
        done();
      });
    });
    

  });
});
 