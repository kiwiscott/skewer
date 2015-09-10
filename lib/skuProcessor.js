/// <reference path="../typings/tsd.d.ts" />
var log = require('log4js').getLogger("skuprocessor");
var fs = require("fs");
/* global t */
var SkuStream = require("./stream/skuStream");
var SkuFilterTransform = require('./stream/skuFilterTransform');
var StringifyStream = require('./stream/stringifyStream');
var SkuCollector = require('./stream/skuCollector');
var SkuCounter = require('./stream/skuCounter');
var SkuDescriptor = require('./stream/skuDescriptor');

function processValidSkus(skuDocument, callback) {
    var skuStream = new SkuStream(skuDocument);
    var stringifyStream = new StringifyStream();
    var sc = new SkuCounter();

    var skuCollector = new SkuCollector();
    var addDescription = new SkuDescriptor(skuDocument.descriptor || null);

    if (fs.existsSync('./results.txt')) fs.unlinkSync('./results.txt');
    var wstream = fs.createWriteStream('./results.txt', { objectMode: true });

    skuStream
        .pipe(addDescription)
        .pipe(skuCollector)
        .pipe(sc)
        .pipe(stringifyStream)
        .pipe(wstream);

    skuCollector.on('finish', function () {
        log.debug('finished skus : ' + sc.Count());
        log.debug('cycles : ' + skuStream.cycles);
        log.debug('skus : ' + skuCollector.Skus().length);

        callback(skuCollector.Skus());
    });
}

module.exports = {
    processValidSkus: processValidSkus
};
