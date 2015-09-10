/// <reference path="../../typings/tsd.d.ts" />
var should = require('should');
var sku = require('../../lib/skuProcessor');
var fs = require('fs');
var  yaml = require('js-yaml');


describe('Sku Variations', function () {
  describe('YAML Apply Default Rules', function () {

    it.only('Rules should filter unwanted options', function (done) {
      var skuSample = yaml.safeLoad(fs.readFileSync('./test/skuProcessor/sku.yaml','utf8'));
      
      sku.processValidSkus(skuSample, function (validSkus, err) {
        var skuCount = 254772;
        validSkus.length.should.equal(skuCount);
        done();
      });
    });
    

  });
});
 