var Core = require('cw-core');
var ArgumentNullException = Core.ArgumentNullException;

var _ = require('underscore');
var Enumerable = require('linq');

var ValidationResult = (function () {
    function ValidationResult(fields, input) {
        this._results = {};
        this._hasError = null;
        if (fields == null) {
            throw new ArgumentNullException('fields');
        }
        if (input == null) {
            throw new ArgumentNullException('input');
        }
        this._fields = Enumerable.from(fields).toObject(function (field) {
            return field.name;
        });
        this._input = input;
    }
    ValidationResult.prototype.inputValue = function (key) {
        if (_.isUndefined(key)) {
            return this._input;
        } else {
            return this._input[key];
        }
    };

    ValidationResult.prototype.validatedValue = function (key) {
        if (_.isUndefined(key)) {
            return Enumerable.from(this.ensureAll()).where(function (p) {
                return !p.value.hasError;
            }).toObject(function (p) {
                return p.key;
            }, function (p) {
                return p.value.validatedValue;
            });
        } else {
            var result = this.ensureValidation(key);
            if (!result.hasError) {
                return result.validatedValue;
            } else {
                return undefined;
            }
        }
    };

    ValidationResult.prototype.get = function (key) {
        if (_.isUndefined(key)) {
            return this.ensureAll();
        } else {
            return this.ensureValidation(key);
        }
    };

    ValidationResult.prototype.ensureValidation = function (key) {
        if (_.has(this._results, key)) {
            return this._results[key];
        } else {
            var field = this._fields[key];
            var v = this._input[key];
            if (!_.isUndefined(field) && !_.isUndefined(v)) {
                var result = field.validate(v, this);
                this._results[key] = result;
                return result;
            } else {
                return null;
            }
        }
    };

    ValidationResult.prototype.ensureAll = function () {
        for (var key in this._input) {
            this.ensureValidation(key);
        }
        return this._results;
    };

    Object.defineProperty(ValidationResult.prototype, "hasError", {
        get: function () {
            if (this._hasError == null) {
                this._hasError = Enumerable.from(this.ensureAll()).any(function (result) {
                    return result.value.hasError;
                });
            }
            return this._hasError;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(ValidationResult.prototype, "success", {
        get: function () {
            return !this.hasError;
        },
        enumerable: true,
        configurable: true
    });
    return ValidationResult;
})();

module.exports = ValidationResult;
//# sourceMappingURL=ValidationResult.js.map
