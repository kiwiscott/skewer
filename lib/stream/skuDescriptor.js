/// <reference path="../../typings/tsd.d.ts" />
/* global t */
var Transform = require('stream').Transform;
var util = require('util');

module.exports = SkuDescriptor;

function SkuDescriptor(aDescriptorFunction) {
    if ((aDescriptorFunction == null || aDescriptorFunction.length == 0)) {
        this.descriptior = function (sku) { return 'Not Defined' };
    }
    else {
        eval('this.descriptior =  ' + aDescriptorFunction);
    }

    Transform.call(this, { objectMode: true });
    this._array = [];
}
util.inherits(SkuDescriptor, Transform);

SkuDescriptor.prototype._transform = function (sku, enc, cb) {
    var self = this;
    sku.description = this.descriptior(sku);
    self.push(sku);
    cb();
};