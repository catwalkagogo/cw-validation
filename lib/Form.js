var Core = require('cw-core');
var ArgumentException = Core.ArgumentException;

var Field = require('./Field');
var Enumerable = require('linq');
var _ = require('underscore');

var ValidationResult = require('./ValidationResult');

var DelegateValidator = require('./DelegateValidator');

var Form = (function () {
    function Form() {
        this._fields = [];
        this._rules = _.extend(Form.baseRules, {});
    }
    Object.defineProperty(Form, "baseRules", {
        get: function () {
            if (Form._baseRules == null) {
                var baseRules = {};
                var validator = require('validator');
                for (var p in validator) {
                    (function () {
                        var func = validator[p];
                        if (_.isFunction(func)) {
                            baseRules[p] = new DelegateValidator(function (args) {
                                return func.apply(validator, [args.value].concat(args.parameters));
                            });
                        }
                    })();
                }

                var required = {
                    validate: function (args) {
                        return args.value != '';
                    }
                };
                baseRules['required'] = required;
                (function () {
                    var selectValues = function (args) {
                        return Enumerable.from(args.parameters).where(function (v) {
                            return _.isString(v);
                        }).select(function (name) {
                            return args.result.inputValue(name);
                        });
                    };
                    var selectFunctions = function (args) {
                        return Enumerable.from(args.parameters).where(function (v) {
                            return _.isFunction(v);
                        }).select(function (v) {
                            return v(args);
                        });
                    };
                    var requiredWith = {
                        validate: function (args) {
                            var check1 = selectValues(args).all(function (v) {
                                return required.validate(v);
                            });
                            var check2 = selectFunctions(args).all(function (v) {
                                return v;
                            });
                            return (check1 && check2) ? required.validate(args.value) : true;
                        }
                    };
                    baseRules['requiredWith'] = requiredWith;
                    baseRules['requiredWithAll'] = requiredWith;
                    baseRules['requiredWithAny'] = {
                        validate: function (args) {
                            var check1 = selectValues(args).any(function (v) {
                                return required.validate(v);
                            });
                            var check2 = selectFunctions(args).any(function (v) {
                                return v;
                            });
                            return (check1 || check2) ? required.validate(args.value) : true;
                        }
                    };
                })();

                Form._baseRules = baseRules;
            }
            return Form._baseRules;
        },
        enumerable: true,
        configurable: true
    });

    Form.prototype.hasRule = function (rule) {
        return _.has(this._rules, rule);
    };

    Form.prototype.addRule = function (rule, validator) {
        if (this.hasRule(rule)) {
            throw new ArgumentException('rule:' + rule + ' has already exist');
        }

        this._rules[rule] = validator;
    };

    Form.prototype.removeRule = function (rule) {
        return delete this._rules[rule];
    };

    Form.prototype.getValidator = function (rule) {
        return this._rules[rule];
    };

    Form.prototype.validate = function (input) {
        return new ValidationResult(this._fields, input);
    };

    Form.prototype.addField = function (name) {
        return this.insertField(-1, name);
    };

    Form.prototype.insertField = function (idx, name) {
        if (idx < 0) {
            idx = this._fields.length + idx + 1;
        }
        if (this.findField(name) >= 0) {
            throw new ArgumentException('name', 'field "' + name + '" is already exists.');
        }
        var field = new Field(this, name);
        this._fields.splice(idx, 0, field);
        return field;
    };

    Form.prototype.findField = function (name) {
        return Enumerable.from(this._fields).indexOf(function (field) {
            return field.name == name;
        });
    };
    return Form;
})();

module.exports = Form;
//# sourceMappingURL=Form.js.map
