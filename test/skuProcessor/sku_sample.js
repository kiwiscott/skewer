/// <reference path="../../typings/tsd.d.ts" />
var should = require('should');
var sku = require('../../lib/skuProcessor');


 describe('Sku Variations', function () {
   describe('Apply Default Rules', function () {
 
     it('Rules should filter unwanted options', function (done) {
        sku.processValidSkus(sc, function (validSkus, err) {
         var skuCount = 23328;
         validSkus.length.should.equal(skuCount);
         done();
       });
     });
 
   });
 });

var yn = [
  { "value": "Yes" },
  { "value": "No" }
];
var size = [
  { "value": "Medium" },
  { "value": "Large" },
  { "value": "X-Large" },
  { "value": "N/A" }
];

var dc = [
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
  { "value": "Basingstoke", "display": "Basingstoke, Data Center" },
  { "value": "NONE", "display": " None" }
];

var sc = {
  "attributes": [
    { "code": "appResiliency", "values": [{ "value": "Standalone with DR" }, { "value": "Local HA with DR" }] },
    { "code": "templateRegion", "values": [{ "value": "NA" }, { "value": "EMEA" }, { "value": "APAC" }] },

    // { "code": "dev", "values": yn },
    // { "code": "devSize", "values": size },
    // { "code": "devDc", "values": dc },

    { "code": "uat", "values": yn },
    { "code": "uatSize", "values": size },
    { "code": "uatDc", "values": dc },

    { "code": "prodDr", "values": yn },
    { "code": "prodDrSize", "values": size },
    { "code": "prodDc", "values": dc },
    { "code": "drDc", "values": dc }
  ],
  "rules": [
    // {
    //   attribute: "devDc",
    //   tests: [
    //     { when: "x-dev = 'Yes'", then: ["Yokohama", "Virginia", "Tokyo", "EDC1", "SYD-Global", "SYD-Digital", "Carlstadt", "Belleville", "RDC1", "HK-Equinix", "HK-Cavendish", "OTDC2", "MCC", "CDC2", "CDC1", "RDC2", "Basingstoke"] },
    //     { when: "x-dev = 'No'", then: ["NONE"] }
    //   ]
    // },
    {
      attribute: "uatDc",
      tests: [
        { when: "x-uat = 'Yes'", then: ["Yokohama", "Virginia", "Tokyo", "EDC1", "SYD-Global", "SYD-Digital", "Carlstadt", "Belleville", "RDC1", "HK-Equinix", "HK-Cavendish", "OTDC2", "MCC", "CDC2", "CDC1", "RDC2", "Basingstoke"] },
        { when: "x-uat = 'No'", then: ["NONE"] }
      ]
    },
    {
      attribute: "prodDc",
      tests: [
        { when: "x-prodDr = 'Yes'", then: ["Yokohama", "Virginia", "Tokyo", "EDC1", "SYD-Global", "SYD-Digital", "Carlstadt", "Belleville", "RDC1", "HK-Equinix", "HK-Cavendish", "OTDC2", "MCC", "CDC2", "CDC1", "RDC2", "Basingstoke"] },
        { when: "x-prodDr = 'No'", then: ["NONE"] }
      ]
    },
    {
      attribute: "prodDrSize",
      tests: [
        { when: "x-prodDr = 'Yes'", then: ["Medium", "Large", "X-Large"] },
        { when: "x-prodDr = 'No'", then: ["N/A"] }
      ]
    },
    {
      attribute: "prodDc",
      tests: [
        { when: "x-templateRegion = 'APAC'", then: ["Yokohama", "Tokyo", "SYD-Global", "SYD-Digital", "HK-Equinix", "HK-Cavendish"] },
        { when: "x-templateRegion = 'NA'", then: ["Virginia", "EDC1", "Carlstadt", "Belleville", "RDC1", "MCC", "CDC2", "CDC1", "RDC2"] },
        { when: "x-templateRegion = 'EMEA'", then: ["OTDC2", "RDC2", "Basingstoke"] }
      ]
    },
    {
      attribute: "drDc",
      tests: [
        { when: "x-templateRegion = 'APAC'", then: ["Yokohama", "Tokyo", "SYD-Global", "SYD-Digital", "HK-Equinix", "HK-Cavendish"] },
        { when: "x-templateRegion = 'NA'", then: ["Virginia", "EDC1", "Carlstadt", "Belleville", "RDC1", "MCC", "CDC2", "CDC1", "RDC2"] },
        { when: "x-templateRegion = 'EMEA'", then: ["OTDC2", "RDC2", "Basingstoke"] }
      ]
    },
    {
      attribute: "uatDc",
      tests: [
        { when: "x-templateRegion = 'APAC'", then: ["Yokohama", "Tokyo", "SYD-Global", "SYD-Digital", "HK-Equinix", "HK-Cavendish"] },
        { when: "x-templateRegion = 'NA'", then: ["Virginia", "EDC1", "Carlstadt", "Belleville", "RDC1", "MCC", "CDC2", "CDC1", "RDC2"] },
        { when: "x-templateRegion = 'EMEA'", then: ["OTDC2", "RDC2", "Basingstoke"] }
      ]
    },
    // {
    //   attribute: "devDc",
    //   tests: [
    //     { when: "x-templateRegion = 'APAC'", then: ["Yokohama", "Tokyo", "SYD-Global", "SYD-Digital", "HK-Equinix", "HK-Cavendish"] },
    //     { when: "x-templateRegion = 'NA'", then: ["Virginia", "EDC1", "Carlstadt", "Belleville", "RDC1", "MCC", "CDC2", "CDC1", "RDC2"] },
    //     { when: "x-templateRegion = 'EMEA'", then: ["OTDC2", "RDC2", "Basingstoke"] }
    //   ]
    // },
    {
      attribute: "drDc",
      tests: [
        { when: "x-prodDr = 'Yes'", then: ["Yokohama", "Virginia", "Tokyo", "EDC1", "SYD-Global", "SYD-Digital", "Carlstadt", "Belleville", "RDC1", "HK-Equinix", "HK-Cavendish", "OTDC2", "MCC", "CDC2", "CDC1", "RDC2", "Basingstoke"] },
        { when: "x-prodDr = 'No'", then: ["NONE"] }
      ]
    }
  ]
};




