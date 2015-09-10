/// <reference path="../../typings/tsd.d.ts" />
/* global t */
var Transform = require('stream').Transform;
var util = require('util');
var log = require('log4js').getLogger("skucounter");

module.exports = SkuCounter;

function SkuCounter() {
    Transform.call(this, { objectMode: true, highWaterMark: (200 * 1024) });
    this._count = 0;
}
util.inherits(SkuCounter, Transform);

SkuCounter.prototype._transform = function (sku, enc, cb) {
    var self = this;
    self._count++;
    if (self._count % 100000 == 0) {
        log.debug('recieved skus : ' + self._count);
    };
    self.push(sku);
    cb();
};

SkuCounter.prototype.Count = function () {
    return this._count;
}



