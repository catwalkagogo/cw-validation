var Core = require('cw-core');
var Exception = Core.Exception;
var ArgumentNullException = Core.ArgumentNullException;
var ArgumentException = Core.ArgumentException;
var Arr = Core.Arr;

var Enumerable = require('linq');
var _ = require('underscore');

var Field = (function () {
    function Field(form, name) {
        this._rules = [];
        if (form == null) {
            throw new ArgumentNullException('form');
        }
        this._form = form;
        this.name = name;
    }
    Object.defineProperty(Field.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (name) {
            this._name = name;
        },
        enumerable: true,
        configurable: true
    });


    Field.prototype.addRule = function () {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            args[_i] = arguments[_i + 0];
        }
        return this.insertRule.apply(this, [this._rules.length].concat(args));
    };

    Field.prototype.insertRule = function (idx, rule) {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 2); _i++) {
            args[_i] = arguments[_i + 2];
        }
        if (idx < 0) {
            idx = this._rules.length + idx + 1;
        }
        if (_.isString(rule)) {
            this._rules.splice(idx, 0, new RuleObject(rule, null, null, args));
        } else if (!_.isUndefined(rule.validate)) {
            var name = Arr.get(args, 0, null);
            args = args.splice(0, 1);
            this._rules.splice(idx, 0, new RuleObject(name, null, rule, args));
        } else if (_.isFunction(rule)) {
            this._rules.splice(idx, 0, new RuleObject(null, rule, null, args));
        } else {
            throw new ArgumentException('rule', 'rule parameter must be string or function.');
        }
        return this;
    };

    Field.prototype.removeRule = function (rule) {
        var idx;
        while ((idx = this.findRule(rule)) >= 0) {
            delete this._rules[idx];
        }
        return this;
    };

    Field.prototype.validate = function (v, result) {
        var _this = this;
        var rules = Enumerable.from(this._rules);

        var error = null;
        var validated = true;
        var validatedValue = v;
        rules.forEach(function (rule) {
            if (validated) {
                var args = {
                    value: validatedValue,
                    result: result,
                    parameters: rule.arguments,
                    form: _this._form
                };
                var result = rule.validate(_this, args);
                if (_.isBoolean(result)) {
                    validated = validated && result;
                } else {
                    validatedValue = result;
                }

                if (!validated) {
                    error = {
                        field: _this,
                        rule: rule.name,
                        value: validatedValue,
                        arguments: rule.arguments
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

    Field.prototype.findRule = function (rule) {
        if (_.isString(rule)) {
            return Enumerable.from(this._rules).indexOf(function (v) {
                return v.name == rule;
            });
        } else if (_.isFunction(rule)) {
            return Enumerable.from(this._rules).indexOf(function (v) {
                return v.validator == rule;
            });
        }
        return -1;
    };

    Object.defineProperty(Field.prototype, "form", {
        get: function () {
            return this._form;
        },
        enumerable: true,
        configurable: true
    });
    return Field;
})();

var RuleObject = (function () {
    function RuleObject(name, func, validator, arguments) {
        this.name = name;
        this.function = func;
        this.validator = validator;
        this.arguments = arguments;
    }
    RuleObject.prototype.validate = function (field, args) {
        if (this.function != null) {
            return this.function.apply(field, [args.value].concat(this.arguments));
        } else if (this.validator != null) {
            return this.validator.validate(args);
        } else {
            var validator = field.form.getValidator(this.name);
            if (!validator) {
                throw new Exception('Rule:' + this.name + " is not found.");
            }
            return validator.validate(args);
        }
    };
    return RuleObject;
})();

module.exports = Field;
//# sourceMappingURL=Field.js.map
