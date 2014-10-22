var Core = require('cw-core');
var ArgumentNullException = Core.ArgumentNullException;
var ArgumentException = Core.ArgumentException;
var Arr = Core.Arr;

var Enumerable = require('linq');
var _ = require('underscore');

var ValidationField = (function () {
    function ValidationField(form, name) {
        this._rules = [];
        if (form == null) {
            throw new ArgumentNullException('form');
        }
        this._form = form;
        this.name = name;
    }
    Object.defineProperty(ValidationField.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (name) {
            this._name = name;
        },
        enumerable: true,
        configurable: true
    });


    ValidationField.prototype.addRule = function (rule) {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            args[_i] = arguments[_i + 1];
        }
        return this.insertRule.apply(this, [-1, rule].concat(args));
    };

    ValidationField.prototype.insertRule = function (idx, rule) {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 2); _i++) {
            args[_i] = arguments[_i + 2];
        }
        if (idx < 0) {
            idx = this._rules.length + idx + 1;
        }
        if (_.isString(rule)) {
            if (this._form.hasRule(rule)) {
                this._rules.splice(idx, 0, {
                    name: rule,
                    arguments: args
                });
            } else {
                throw new ArgumentException('rule', 'Specified rule is not found.');
            }
        } else if (_.isFunction(rule)) {
            var name = Arr.get(args, 0);
            this._rules.splice(idx, 0, {
                name: name,
                function: rule
            });
        } else {
            throw new ArgumentException('rule', 'rule parameter must be string or function.');
        }
        return this;
    };

    ValidationField.prototype.removeRule = function (rule) {
        var idx;
        while ((idx = this.findRule(rule)) >= 0) {
            delete this._rules[idx];
        }
        return this;
    };

    ValidationField.prototype.validate = function (v, result) {
        var _this = this;
        var rules = Enumerable.from(this._rules).select(function (rule) {
            if (rule.function) {
                return function (_v) {
                    return ({
                        name: rule.name,
                        self: _this,
                        func: rule.function,
                        arguments: [_v, result]
                    });
                };
            } else {
                return function (_v) {
                    return ({
                        name: rule.name,
                        self: _this._form.Validator,
                        func: _this.getRuleFunction(rule.name),
                        arguments: [_v].concat(rule.arguments)
                    });
                };
            }
        });

        var error = null;
        var validated = true;
        var validatedValue = v;
        rules.forEach(function (rule) {
            if (validated) {
                var delegate = rule(validatedValue);

                var result = delegate.func.apply(delegate.self, delegate.arguments);
                if (_.isBoolean(result)) {
                    validated = validated && result;
                } else {
                    validatedValue = result;
                }

                if (!validated) {
                    error = {
                        field: _this,
                        rule: delegate.name,
                        value: validatedValue,
                        arguments: delegate.arguments
                    };
                }
            }
        });

        return {
            hasError: !validated,
            error: error,
            validatedValue: validatedValue
        };
    };

    ValidationField.prototype.getRuleFunction = function (rule) {
        var func = this._form.Validator[rule];
        if (_.isFunction(func)) {
            return func;
        } else {
            return null;
        }
    };

    ValidationField.prototype.findRule = function (rule) {
        if (_.isString(rule)) {
            return Enumerable.from(this._rules).indexOf(function (v) {
                return v.name == rule;
            });
        } else if (_.isFunction(rule)) {
            return Enumerable.from(this._rules).indexOf(function (v) {
                return v.function == rule;
            });
        }
        return -1;
    };
    return ValidationField;
})();

module.exports = ValidationField;
//# sourceMappingURL=ValidationField.js.map
