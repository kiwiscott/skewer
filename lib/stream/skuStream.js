/// <reference path="../../typings/tsd.d.ts" />
var Readable = require('stream').Readable;
var util = require('util');
var log = require('log4js').getLogger("skustream");

//Public
module.exports = SkuStream;
function SkuStream(skuAttributes) {
	Readable.call(this, { objectMode: true });
	this._currentIndex = -1;
    this._skuAttributes = skuAttributes;
	this._maxIndex = this._maxIndex();
	this._divisors = this._getDivisors();
}

util.inherits(SkuStream, Readable);

SkuStream.prototype._read = function () {
	var self = this;
	self._currentIndex += 1;

	if (this._currentIndex < 0 || this._currentIndex >= this._maxIndex) {
		this.push(null);
		return;
	}
	var permutation = self.permutationAtIndex(self._currentIndex);

	if (self._currentIndex % 250000 == 0) {
		log.debug('processed skus : ' + self._addCommas(self._currentIndex) + ' of ' + self._addCommas(self._maxIndex));
		setImmediate(function () {
			self.push(permutation);
		});
    } else {
		self.push(permutation);
	}
};


SkuStream.prototype._addCommas = function (nStr) {
	nStr += '';
	var x = nStr.split('.');
	var x1 = x[0];
	var x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

SkuStream.prototype.permutationAtIndex = function (index) {
	if (index < 0 || index >= this._maxIndex) return null;
	var result = {}, skuAttr;

	for (var i = 0; i < this._skuAttributes.length; i++) {
		skuAttr = this._skuAttributes[i];
		result[skuAttr.code] = skuAttr.values[Math.floor(index / this._divisors[i]) % skuAttr.values.length].value;
	}
	return result;
}

SkuStream.prototype._maxIndex = function () {
	return this._skuAttributes.reduce(function (value, attribute) {
		return attribute.values.length * value;
	}, 1);
}
SkuStream.prototype._getDivisors = function () {
	var divisors = [];
	for (var i = this._skuAttributes.length - 1; i >= 0; i--) {
		divisors[i] = divisors[i + 1] ? divisors[i + 1] * this._skuAttributes[i + 1].values.length : 1;
	}
	return divisors;
}
