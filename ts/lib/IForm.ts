import Field = require('./Field');
import ValidationResult = require('./ValidationResult');
import Validator = require('./Validator');

interface IForm {
	hasRule(rule: string): boolean;

	addRule(rule: string, validator: Validator): void;

	removeRule(rule: string): boolean;

	getValidator(rule: string): Validator;

	validate(input: {}): ValidationResult;

	addField(name: string): Field<Field<any>>;

	insertField(idx: number, name: string): Field<Field<any>>;
}

export = IForm;