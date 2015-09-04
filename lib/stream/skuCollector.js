/// <reference path="../../typings/tsd.d.ts" />
/* global t */
var Transform = require('stream').Transform;
var util = require('util');

module.exports = SkuCollector;

function SkuCollector() {
    Transform.call(this, { objectMode: true });
    this._array = [];
}
util.inherits(SkuCollector, Transform);

SkuCollector.prototype._transform = function (sku, enc, cb) {
    var self = this;
    self._array.push(sku);
    self.push(sku);
    cb();
};

SkuCollector.prototype.Skus = function () {
    return this._array;
}

