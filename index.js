/// <reference path="./typings/tsd.d.ts" />
		
var Readable = require('stream').Readable;
var Writable = require('stream').Writable;
var util = require('util');
var tenMillion = 100000000;
//var tenMillion = 5000000; //THIS WORKS
var writeEvery = tenMillion / 1000;
		
/*
* Create a really simple stream that will run 10 million times 
*/
function Streamo(max) {
	Readable.call(this, { objectMode: true });
	this._currentIndex = -1;
	this._maxIndex = max;
}

util.inherits(Streamo, Readable);

Streamo.prototype._read = function () {
	var self = this;

	self._currentIndex += 1;
	if (self._currentIndex % writeEvery == 0) {
		console.log(self._currentIndex + ' of ' + self._maxIndex)
	};

	if (self._currentIndex < 0 || self._currentIndex >= self._maxIndex) {
		console.log("DONE STREAMO");
		self.push(null);
		return;
	}

	if (self._currentIndex % writeEvery == 0) {
		setImmediate(function () {
			self.push(true);
		});
    } else {
		self.push(true);
	}


};
		
/*
* Create a really simple Writable Stream to Count 
*/

function Counta() {
	Writable.call(this, { objectMode: true, highWaterMark: (200 * 1024) });
	this._count = 0;
}
util.inherits(Counta, Writable);

Counta.prototype._write = function (chunk, enc, cb) {
	this._count++;
	if (this._count % writeEvery == 0) {
		console.log('_______________________________' + this._count)
	};
	cb();
};

Counta.prototype.Count = function () {
	return this._count;
}
		
		
/*
* Exercise It 
*/
var s = new Streamo(tenMillion);
var c = new Counta();
//s.pipe(c);

var f = function () { };
s.on('data', function (data) {
	var ok = c.write(data, null, f);
	if (!ok) {
		console.log("CRAP CRAP CRAP CRAP CRAP CRAP CRAP CRAP CRAP CRAP CRAP CRAP CRAP CRAP CRAP CRAP CRAP CRAP CRAP CRAP CRAP CRAP CRAP CRAP CRAP CRAP CRAP CRAP CRAP CRAP CRAP CRAP CRAP ")
	}

});
s.on('finish', function () {
	c.end();
});
c.on('finish', function () {
	console.log("BOOM BOOM BOOM BOOM BOOM BOOM BOOM BOOM BOOM ")
});
		
		
		
		
		
