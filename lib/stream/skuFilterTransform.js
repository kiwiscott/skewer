/// <reference path="../../typings/tsd.d.ts" />
/* global t */
var Transform = require('stream').Transform;
var util = require('util');

module.exports = SkuFilterTransform;
function SkuFilterTransform(rules) {
    Transform.call(this, { objectMode: true });
    this._rules = this._processTheRules(rules || null);
}

util.inherits(SkuFilterTransform, Transform);

SkuFilterTransform.prototype._transform = function (sku, enc, cb) {
    var self = this;
    if (self._rules == null) {
        self.push(sku);
        cb();
        return;
    }
    
    var validSku = this.isValidSku(sku, this._rules);
    if (validSku) {
        self.push(sku);
    }
    cb();
};

SkuFilterTransform.prototype.isValidSku = function (sku, rules) {
    if (rules == null || rules.length == 0) return true;

    for (var i = 0; i < rules.length; i++) {
        var rule = rules[i];

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

SkuFilterTransform.prototype._processTheRules = function (skuRules) {
    var self = this;
    if (skuRules == null || skuRules.length == 0) return null;


    var copiedRules = JSON.parse(JSON.stringify(skuRules));
    copiedRules.forEach(function (r) {

        r.tests.forEach(function (test) {
            var builtTest = self._createTest(test.when);
            eval(builtTest);
            test.executableTest = t;
        });
    });

    return copiedRules;
}

SkuFilterTransform.prototype._createTest = function (test) {
    var temp = test.replace('x-', 'x.').replace('=', '==');
    var requiredTest = "function t(x) { return " + temp + ";}";
    return requiredTest;
}
