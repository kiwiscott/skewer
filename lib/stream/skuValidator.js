/// <reference path="../../typings/tsd.d.ts" />
var pair = require('./pair');
var util = require('util');
/* global t */

module.exports = SkuValidator;
function SkuValidator(rules, attributes) {
    this._inValidPairs = this.invalidPairs(rules, attributes);
}

SkuValidator.prototype.isValidSku = function (skuArrayOfIndicies) {
    var whenIndex = 0, whenValueIndex = 0;
    var thenIndex = 0, thanValueIndex = 0;

    for (var index = 0; index < this._inValidPairs.length; index++) {
        var pairs = this._inValidPairs[index];
        whenIndex = pairs[0].array
        whenValueIndex = pairs[0].position;
        thenIndex = pairs[1].array
        thanValueIndex = pairs[1].position;

        if (skuArrayOfIndicies[whenIndex] == whenValueIndex && skuArrayOfIndicies[thenIndex] == thanValueIndex) {
            return false;
        }
    }
    return true;
}

SkuValidator.prototype.findIndexOfAttribute = function (attributes, name) {
    for (var index = 0; index < attributes.length; index++) {
        if (attributes[index].code == name)
            return index;
    }
    return -1;
}

SkuValidator.prototype.findIndexOfAttributeValues = function (attribute, values) {
    var indices = [];
    values.forEach(function (value) {
        attribute.values.forEach(function (attrValue, index, array) {
            if (values == attrValue.value) {
                indices.push(index);
            }
        });
    }, this);
    return indices;
}

SkuValidator.prototype.findIndexOfOtherAttributeValues = function (attribute, values) {
    var indices = [];

    attribute.values.forEach(function (attrValue, index, array) {
        if (values.indexOf(attrValue.value) == -1) {
            indices.push(index);
        }
    });
    return indices;
}

SkuValidator.prototype.invalidPairs = function (rules, attributes) {
    var self = this;

    if (rules == null || rules.length == 0) return [];

    var pairs = [];

    for (var index = 0; index < rules.length; index++) {
        var rule = rules[index];

        if (rule.hasOwnProperty("when")) {
            self.buildWhenRule(pairs, rule, attributes);
        } else if (rule.hasOwnProperty("cannotBeSame")) {
            self.buildCannotBeSameRule(pairs, rule, attributes);
        }
    }
    return pairs;

}

//{ cannotBeSame: ["prodDc", "drDc"] }
SkuValidator.prototype.buildCannotBeSameRule = function (pairs, rule, attributes) {
    var self = this;

    var first = self.findIndexOfAttribute(attributes, rule.cannotBeSame[0]);
    var second = self.findIndexOfAttribute(attributes, rule.cannotBeSame[1]);


    attributes[first].values.forEach(function (firstItem, firstIndex, farray) {
        attributes[second].values.forEach(function (secondItem, secondIndex, sarray) {
            if (firstItem.value == secondItem.value) {
                pairs.push(pair.invalidPair(first, firstIndex, second, secondIndex));
            }
        });
    });
}

SkuValidator.prototype.buildWhenRule = function (pairs, rule, attributes) {
    var self = this;

    var whenIndex = self.findIndexOfAttribute(attributes, rule.when[0]);
    var thenIndex = self.findIndexOfAttribute(attributes, rule.then[0]);
    var whenValueIndexes = self.findIndexOfAttributeValues(attributes[whenIndex], rule.when.slice(1));
    var thenValueIndexes = self.findIndexOfOtherAttributeValues(attributes[thenIndex], rule.then.slice(1));

    for (var wi = 0; wi < whenValueIndexes.length; wi++) {
        var whenValue = whenValueIndexes[wi];
        for (var ti = 0; ti < thenValueIndexes.length; ti++) {
            var thenValue = thenValueIndexes[ti];
            pairs.push(pair.invalidPair(whenIndex, whenValue, thenIndex, thenValue));
        }
    }
}


