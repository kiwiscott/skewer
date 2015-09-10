/// <reference path="../../typings/tsd.d.ts" />

function Pair(array, position) {
    this.array = array;
    this.position = position;
}

module.exports = {
    invalidPair: function (arrayIndexA, positionIndexA, arrayIndexB, positionIndexB) {
        return [new Pair(arrayIndexA, positionIndexA), new Pair(arrayIndexB, positionIndexB)];
    }
}