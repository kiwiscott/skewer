/// <reference path="../../typings/tsd.d.ts" />
/* global t */
var Transform = require('stream').Transform;
var util = require('util');
var SkuValidator = require('./SkuValidator');

module.exports = SkuFilterTransform;
function SkuFilterTransform(rules) {
    Transform.call(this, { objectMode: true });
    this._skuValidator = new SkuValidator(rules);
}

util.inherits(SkuFilterTransform, Transform);

SkuFilterTransform.prototype._transform = function (sku, enc, cb) {
    var self = this;
    if (self._rules == null) {
        self.push(sku);
        cb();
        return;
    }
    
    var validSku = this._skuValidator(sku, this._rules);
    if (validSku) {
        self.push(sku);
    }
    cb();
};
