/// <reference path="../../typings/tsd.d.ts" />
var Readable = require('stream').Readable;
var util = require('util');
var log = require('log4js').getLogger("skustream");
var SkuValidator = require('./SkuValidator')

//Public
module.exports = SkuStream;
function SkuStream(skuDocument) {
	Readable.call(this, { objectMode: true });
	this.cycles = 0;
	this._currentIndex = -1;
    this._skuAttributes = skuDocument.attributes;
	this._maxIndex = this._maxIndex();
	this._divisors = this._getDivisors();
	this._skuValidator = new SkuValidator(skuDocument.rules, skuDocument.attributes);
}
util.inherits(SkuStream, Readable);
/******************************************************************************************************
 * This is trying to reduce the reading 
******************************************************************************************************/

SkuStream.prototype._read = function () {
	var self = this;
	self.cycles++;
	self._currentIndex += 1;

	if (this._currentIndex < 0 || this._currentIndex >= this._maxIndex) {
		this.push(null);
		return;
	}

	var permutation = self.permutationArrayAtIndex(self._currentIndex);
	if (this._skuValidator.isValidSku(permutation)) {
		this._pushValid(self._currentIndex, self.cycles % 20000 == 0);
	}
	else {
		this._skipThenReadAgain(permutation, self.cycles % 20000 == 0);
	}
};

SkuStream.prototype._skipThenReadAgain = function (permutation, pushAsImmediate) {
	var self = this;

	var valid = false;
	var lastInvalid = permutation;
	while (!valid) {
		lastInvalid = permutation;
		permutation = lastInvalid.slice(0, lastInvalid.length - 1);
		valid = self._skuValidator.isValidSku(permutation);
	}

	var nextIndex = -1;
	var first = true;
	for (var i = lastInvalid.length - 1; i >= 0; i--) {
		var multiplier = first ? lastInvalid[i] + 1 : lastInvalid[i];

		nextIndex += self._divisors.slice(i + 1).reduce(function (previousValue, currentValue, index, array) {
			return previousValue * currentValue[1];
		}, multiplier);

		first = false;
	}
	
	//log.debug(lastInvalid + ' - ' + nextIndex + ' - ' + JSON.stringify(self.permutationArrayAtIndex(nextIndex)) + ' - ' + JSON.stringify(self.permutationAtIndex(nextIndex)));

	self._currentIndex = nextIndex ;

	if (pushAsImmediate) {
		setImmediate(function () {
			self._read();
		});
	}
	else {
		self._read();
	}
}

SkuStream.prototype._pushValid = function (index, pushAsImmediate) {
	var self = this;
	var sku = self.permutationAtIndex(self._currentIndex);

	if (pushAsImmediate) {
		log.debug('processed skus : ' + self._addCommas(index) + ' of ' + self._addCommas(self._maxIndex));

		setImmediate(function () {
			self.push(sku);
		});
	}
	else {
		self.push(sku);
	}
}



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


SkuStream.prototype.isValidPermutationArray = function (permutationArray) {
	return this._skuValidator.isValidSku(permutationArray, this._rules);
}

SkuStream.prototype.permutationArrayAtIndex = function (index) {
	if (index < 0 || index >= this._maxIndex) return null;
	var resultArray = [], skuAttr;

	for (var i = 0; i < this._skuAttributes.length; i++) {
		skuAttr = this._skuAttributes[i];
		var attrValueIndex = Math.floor(index / this._divisors[i][0]) % skuAttr.values.length;
		resultArray.push(attrValueIndex);
	}
	return resultArray;
}
SkuStream.prototype.permutationAtIndex = function (index) {
	if (index < 0 || index >= this._maxIndex) return null;
	var result = {}, skuAttr;

	for (var i = 0; i < this._skuAttributes.length; i++) {
		skuAttr = this._skuAttributes[i];
		var attrValueIndex = Math.floor(index / this._divisors[i][0]) % skuAttr.values.length;
		result[skuAttr.code] = skuAttr.values[attrValueIndex].value;
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
		var div = divisors[i + 1] ? divisors[i + 1][0] * this._skuAttributes[i + 1].values.length : 1;
		divisors[i] = [div, this._skuAttributes[i].values.length];

	}
	return divisors;
}