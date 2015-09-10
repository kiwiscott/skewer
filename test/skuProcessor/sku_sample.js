/// <reference path="../../typings/tsd.d.ts" />
var should = require('should');
var sku = require('../../lib/skuProcessor');


describe('Sku Variations', function () {
  describe('Apply Default Rules', function () {

    it('Rules should filter unwanted options', function (done) {
      sku.processValidSkus(sc, function (validSkus, err) {
        var skuCount = 23328;
        validSkus.length.should.not.equal(skuCount);
        
        done();
      });
    });

  });
});

var yn = [{ "value": "Yes" }, { "value": "No" }];
var size = [{ "value": "Medium" }, { "value": "Large" }, { "value": "X-Large" }, { "value": "NA" }];
var dc = [{ "value": "Yokohama" }, { "value": "Virginia" }, { "value": "Tokyo" }, { "value": "EDC1" }, { "value": "SYD-Global" }, { "value": "SYD-Digital" }, { "value": "Carlstadt" }, { "value": "Belleville" }, { "value": "RDC1" },
  { "value": "HK-Equinix" }, { "value": "HK-Cavendish" }, { "value": "OTDC2" }, { "value": "MCC" }, { "value": "CDC2" }, { "value": "CDC1" }, { "value": "RDC2" }, { "value": "Basingstoke" }, { "value": "NA" }];


var sc = {
  "attributes": [
    { "code": "appResiliency", "values": [{ "value": "Standalone with DR" }, { "value": "Local HA with DR" }] },
    { "code": "templateRegion", "values": [{ "value": "NA" }, { "value": "EMEA" }, { "value": "APAC" }] },

     { "code": "dev", "values": yn },
     { "code": "devSize", "values": size },
     { "code": "devDc", "values": dc },

     { "code": "uat", "values": yn },
     { "code": "uatSize", "values": size },
     { "code": "uatDc", "values": dc },
// 
     { "code": "prodDr", "values": yn },
     { "code": "prodDrSize", "values": size },
     { "code": "prodDc", "values": dc },
     { "code": "drDc", "values": dc }
  ],
  "rules": [
    //DEV
    { when: ["dev", "Yes"], then: ["devDc", "Yokohama", "Virginia", "Tokyo", "EDC1", "SYD-Global", "SYD-Digital", "Carlstadt", "Belleville", "RDC1", "HK-Equinix", "HK-Cavendish", "OTDC2", "MCC", "CDC2", "CDC1", "RDC2", "Basingstoke"] },
    { when: ["dev", "No"], then: ["devDc", "NA"] },

    { when: ["dev", "Yes"], then: ["devSize", "Medium", "Large", "X-Large"] },
    { when: ["dev", "No"], then: ["devSize", "NA"] },

    { when: ["templateRegion", "APAC"], then: ["devDc", "Yokohama", "Tokyo", "SYD-Global", "SYD-Digital", "HK-Equinix", "HK-Cavendish"] },
    { when: ["templateRegion", "NA"], then: ["devDc", "Virginia", "EDC1", "Carlstadt", "Belleville", "RDC1", "MCC", "CDC2", "CDC1", "RDC2"] },
    { when: ["templateRegion", "EMEA"], then: ["devDc", "OTDC2", "RDC2", "Basingstoke"] },

    //UAT
    { when: ["uat", "Yes"], then: ["uatDc", "Yokohama", "Virginia", "Tokyo", "EDC1", "SYD-Global", "SYD-Digital", "Carlstadt", "Belleville", "RDC1", "HK-Equinix", "HK-Cavendish", "OTDC2", "MCC", "CDC2", "CDC1", "RDC2", "Basingstoke"] },
    { when: ["uat", "No"], then: ["uatDc", "NA"] },

    { when: ["uat", "Yes"], then: ["uatSize", "Medium", "Large", "X-Large"] },
    { when: ["uat", "No"], then: ["uatSize", "NA"] },

    { when: ["templateRegion", "APAC"], then: ["uatDc", "Yokohama", "Tokyo", "SYD-Global", "SYD-Digital", "HK-Equinix", "HK-Cavendish"] },
    { when: ["templateRegion", "NA"], then: ["uatDc", "Virginia", "EDC1", "Carlstadt", "Belleville", "RDC1", "MCC", "CDC2", "CDC1", "RDC2"] },
    { when: ["templateRegion", "EMEA"], then: ["uatDc", "OTDC2", "RDC2", "Basingstoke"] },
    
    //PROD
    { when: ["prodDr", "Yes"], then: ["prodDc", "Yokohama", "Virginia", "Tokyo", "EDC1", "SYD-Global", "SYD-Digital", "Carlstadt", "Belleville", "RDC1", "HK-Equinix", "HK-Cavendish", "OTDC2", "MCC", "CDC2", "CDC1", "RDC2", "Basingstoke"] },
    { when: ["prodDr", "No"], then: ["prodDc", "NA"] },

    { when: ["prodDr", "Yes"], then: ["prodDrSize", "Medium", "Large", "X-Large"] },
    { when: ["prodDr", "No"], then: ["prodDrSize", "NA"] },

    { when: ["templateRegion", "APAC"], then: ["prodDc", "Yokohama", "Tokyo", "SYD-Global", "SYD-Digital", "HK-Equinix", "HK-Cavendish"] },
    { when: ["templateRegion", "NA"], then: ["prodDc", "Virginia", "EDC1", "Carlstadt", "Belleville", "RDC1", "MCC", "CDC2", "CDC1", "RDC2"] },
    { when: ["templateRegion", "EMEA"], then: ["prodDc", "OTDC2", "RDC2", "Basingstoke"] },
     
     //DR
     { when: ["templateRegion", "APAC"], then: ["drDc", "Yokohama", "Tokyo", "SYD-Global", "SYD-Digital", "HK-Equinix", "HK-Cavendish"] },
     { when: ["templateRegion", "NA"], then: ["drDc", "Virginia", "EDC1", "Carlstadt", "Belleville", "RDC1", "MCC", "CDC2", "CDC1", "RDC2"] },
     { when: ["templateRegion", "EMEA"], then: ["drDc", "OTDC2", "RDC2", "Basingstoke"] },
     
     { cannotBeSame: ["prodDc", "drDc"] }
  ]
};