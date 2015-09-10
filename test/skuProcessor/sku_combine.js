/// <reference path="../../typings/tsd.d.ts" />

var should = require('should');
var skuProcessor = require('../../lib/skuProcessor');

describe('Calculate Sku Variations', function () {
  describe('No Rules', function () {

    it('One attibute should result in simple count', function (done) {
          var sc = {
            "attributes": [
              { "code": "alpha", "values": [{ "value": "A" }, { "value": "B" }, { "value": "C" }] }
        ]};

       skuProcessor.processValidSkus(sc,function(validSkus){
         var skuCount =3;
              validSkus.length.should.equal(skuCount);
              done(); 
       });
    });
    
    it('Three attibute should result in combination count', function (done) {
        var sc = {
          "attributes": [
            { "code": "alpha", "values": [{ "value": "A" }, { "value": "B" }, { "value": "C" }] },
            { "code": "beta", "values": [{ "value": "1" }, { "value": "2" }, { "value": "3" }] },
            { "code": "gamma", "values": [{ "value": "1" }, { "value": "2" }, { "value": "3" }] }
        ]};
                    
          skuProcessor.processValidSkus(sc,function(validSkus){
            var skuCount =27;
            validSkus.length.should.equal(skuCount);
            done(); 
       });
    });
    
    it('No rules should result in multiplied sku count', function (done) {
        var sc = {
            "attributes" :[
        {
          "code": "region",
          "name": "Region",
          "values": [
            { "value": "EMEA", "display": "EMEA" },
            { "value": "NA", "display": "North America" },
            { "value": "APAC", "display": "Asia Pacific" }
          ]
          },          
          {
          "code": "datacenter",
          "name": "Data Center",
          "values": [
              { "value": "Yokohama", "display": "Yokohama, NR1 Data Center" },
               { "value": "Virginia", "display": "Virginia, Ashburn CBB Data Center" },
               { "value": "Tokyo", "display": "Tokyo, Tokyo Building" },
               { "value": "EDC1", "display": "Texas, EDC1" },
               { "value": "SYD-Global", "display": "Sydney, Global Switch" },
               { "value": "SYD-Digital", "display": "Sydney, Digital Realty Trust" },
               { "value": "Carlstadt", "display": "New Jersey, Carlstadt" },
               { "value": "Belleville", "display": "Michigan, Belleville" },
               { "value": "RDC1", "display": "Illinois, RDC1" },
               { "value": "HK-Equinix", "display": "Hong Kong, Equinix" },
               { "value": "HK-Cavendish", "display": "Hong Kong, Cavendish" },
               { "value": "OTDC2", "display": "Farnborough, OTDC2" },
               { "value": "MCC", "display": "Delaware, MCC" },
               { "value": "CDC2", "display": "Delaware, CDC2" },
               { "value": "CDC1", "display": "Delaware, CDC1" },
               { "value": "RDC2", "display": "Bournemouth, RDC2" },
               { "value": "Basingstoke", "display": "Basingstoke, Data Center" }
          ]
          }
          
          ]};
          
          skuProcessor.processValidSkus(sc,function(validSkus){
            var skuCount = sc.attributes[0].values.length *sc.attributes[1].values.length;
            validSkus.length.should.equal(skuCount);
            done(); 
       });
    });
  })
})