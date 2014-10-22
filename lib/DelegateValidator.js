var DelegateValidator = (function () {
    function DelegateValidator(validator) {
        this._validator = validator;
    }
    DelegateValidator.prototype.validate = function (args) {
        return this._validator(args);
    };
    return DelegateValidator;
})();

module.exports = DelegateValidator;
//# sourceMappingURL=DelegateValidator.js.map
