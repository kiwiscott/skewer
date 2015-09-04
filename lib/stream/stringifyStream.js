var stream = require('stream');
var util = require('util');
var endOfLine = require('os').EOL;

module.exports = StringifyStream;

function StringifyStream() {
    stream.Transform.call(this);

    this._readableState.objectMode = false;
    this._writableState.objectMode = true;
}
util.inherits(StringifyStream, stream.Transform);

StringifyStream.prototype._transform = function (obj, encoding, cb) {
    this.push(JSON.stringify(obj) + endOfLine);
    cb();
};
