var Rule = (function () {
    function Rule(name, validator) {
        this._name = name;
        this._validator = validator;
    }
    Object.defineProperty(Rule.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });

    Rule.prototype.validate = function (value) {
        return this._validator(value);
    };
    return Rule;
})();

module.exports = Rule;
//# sourceMappingURL=Rule.js.map
