var Core = require('cw-core');
var ArgumentException = Core.ArgumentException;

var ValidationField = require('./ValidationField');

var Enumerable = require('linq');
var _ = require('underscore');

var ValidationResult = require('./ValidationResult');

var ValidationForm = (function () {
    function ValidationForm() {
        this._fields = [];
        this._validator = require('validator');

        this._validator.extend('required', function (str) {
            return str != '';
        });
    }
    Object.defineProperty(ValidationForm.prototype, "Validator", {
        get: function () {
            return this._validator;
        },
        enumerable: true,
        configurable: true
    });

    ValidationForm.prototype.hasRule = function (rule) {
        return !_.isUndefined(this._validator[rule]);
    };

    ValidationForm.prototype.validate = function (input) {
        return new ValidationResult(this._fields, input);
    };

    ValidationForm.prototype.addField = function (nameOrField) {
        return this.insertField(-1, nameOrField);
    };

    ValidationForm.prototype.insertField = function (idx, nameOrField) {
        if (idx < 0) {
            idx = this._fields.length + idx + 1;
        }
        if (_.isString(nameOrField)) {
            var name = nameOrField;
            if (this.findField(name) >= 0) {
                throw new ArgumentException('name', 'field "' + name + '" is already exists.');
            }
            var field = new ValidationField(this, name);
            this._fields.splice(idx, 0, field);
            return field;
        } else if (nameOrField instanceof ValidationField) {
            var field = nameOrField;
            if (this.findField(field.name) >= 0) {
                throw new ArgumentException('name', 'field "' + field.name + '" is already exists.');
            }
            this._fields.splice(idx, 0, field);
            return field;
        } else {
            throw new ArgumentException('nameOrField', 'parameter must be string or ValidationField');
        }
    };

    ValidationForm.prototype.findField = function (name) {
        return Enumerable.from(this._fields).indexOf(function (field) {
            return field.name == name;
        });
    };
    return ValidationForm;
})();

module.exports = ValidationForm;
//# sourceMappingURL=ValidationForm.js.map
