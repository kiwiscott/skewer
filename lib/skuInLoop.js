/// <reference path="../typings/tsd.d.ts" />
/* global t */
module.exports = SkuInLoop

function SkuInLoop(skuDocument) {
    this._skuAttributes = skuDocument.attributes;
    this._rules = this.processTheRules(skuDocument.rules || null);
    this._maxIndex = this.maxIndex();
    this._divisors = this.getDivisors();
    this._currentIndex = -1;
};

SkuInLoop.prototype.run = function (callback) {
    var self = this;
    for (var index = 0; index < self._maxIndex; index++) {
        if (index % 100000 == 0) console.log('Processed ' + index);
        var sku = self.permutationAtIndex(index);
        if (this.isValidSku(sku)) {
            callback(sku);
        }
    }
    callback(null);
}


/* Rules */
SkuInLoop.prototype.processTheRules = function (skuRules) {
    var self = this;
    if (skuRules == null || skuRules.length == 0) return null;
    var copiedRules = JSON.parse(JSON.stringify(skuRules));

    copiedRules.forEach(function (r) {
        r.tests.forEach(function (test) {
            var builtTest = self.createTest(test.when);
            eval(builtTest);
            test.executableTest = t;
        });
    });
    return copiedRules;
}

SkuInLoop.prototype.createTest = function (test) {
    var temp = test.replace('x-', 'x.').replace('=', '==');
    var requiredTest = "function t(x) { return " + temp + ";}";
    return requiredTest;
}


SkuInLoop.prototype.isValidSku = function (sku) {
    var self = this;
    if (self._rules == null || self._rules.length == 0) return true;

    for (var i = 0; i < self._rules.length; i++) {
        var rule = self._rules[i];

        for (var j = 0; j < rule.tests.length; j++) {
            var test = rule.tests[j];
            var doesTestApply = sku.hasOwnProperty(rule.attribute) && test.executableTest(sku);

            if (doesTestApply) {

                var match = test.then.filter(function (value) {
                    return sku[rule.attribute] == value;
                })
                if (match.length == 0) return false;
            }
        }
    }
    return true;
}

/*
Index Permutation
*/
SkuInLoop.prototype.permutationAtIndex = function (index) {
    var self = this;
    if (index < 0 || index >= self._maxIndex) return null;

    var result = {}, skuAttr;

    for (var i = 0; i < self._skuAttributes.length; i++) {
        skuAttr = self._skuAttributes[i];
        result[skuAttr.code] = skuAttr.values[Math.floor(index / self._divisors[i]) % skuAttr.values.length].value;
    }
    return result;
}

SkuInLoop.prototype.maxIndex = function () {
    var self = this;
    return self._skuAttributes.reduce(function (value, attribute) {
        return attribute.values.length * value;
    }, 1);
}

SkuInLoop.prototype.getDivisors = function () {
    var self = this;
    var divisors = [];
    for (var i = self._skuAttributes.length - 1; i >= 0; i--) {
        divisors[i] = divisors[i + 1] ? divisors[i + 1] * self._skuAttributes[i + 1].values.length : 1;
    }
    return divisors;
}
