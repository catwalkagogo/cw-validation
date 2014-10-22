import Core = require('cw-core');
import ArgumentException = Core.ArgumentException;

import Field = require('./Field');
import Enumerable = require('linq');
import _ = require('underscore');
import FieldValidationResult = require('./FieldValidationResult');
import ValidationResult = require('./ValidationResult');
import ValidationArgs = require('./ValidationArgs');
import Validator = require('./Validator');
import DelegateValidator = require('./DelegateValidator');
import IForm = require('./IForm');

class Form implements IForm{
	private static _baseRules: { [key: string]: Validator };

	private static get baseRules(): { [key: string]: Validator } {
		if(Form._baseRules == null) {
			var baseRules: { [key: string]: Validator } = {};
			var validator = require('validator');
			for(var p in validator) {
				(() => {
					var func = validator[p];
					if(_.isFunction(func)) {
						baseRules[p] = new DelegateValidator((args: ValidationArgs) => {
							return func.apply(validator, [args.value].concat(args.parameters));
						});
					}
				})();
			}

			// build-ins
			var required = {
				validate: (args: ValidationArgs) => {
					return args.value != '';
				}
			};
			baseRules['required'] = required;
			(() => {
				var selectValues = (args: ValidationArgs) => {
					return Enumerable
						.from(args.parameters)
						.where(v => _.isString(v))
						.select(name => args.result.inputValue(name));
				};
				var selectFunctions = (args: ValidationArgs) => {
					return Enumerable
						.from(args.parameters)
						.where(v => _.isFunction(v))
						.select(v => v(args));
				};
				var requiredWith = {
					validate: (args: ValidationArgs) => {
						var check1 = selectValues(args)
							.all(v => required.validate(v));
						var check2 = selectFunctions(args)
							.all(v => v);
						return (check1 && check2) ? required.validate(args.value) : true;
					}
				};
				baseRules['requiredWith'] = requiredWith;
				baseRules['requiredWithAll'] = requiredWith;
				baseRules['requiredWithAny'] = {
					validate: (args: ValidationArgs) => {
						var check1 = selectValues(args)
							.any(v => required.validate(v));
						var check2 = selectFunctions(args)
							.any(v => v);
						return (check1 || check2) ? required.validate(args.value) : true;
					}
				};
			})();

			Form._baseRules = baseRules;
		}
		return Form._baseRules;
	}

	private _rules: { [key: string]: Validator };
	private _fields: Field<any>[] = [];

	public constructor() {
		this._rules = _.extend(Form.baseRules, {});
	}

	public hasRule(rule: string): boolean {
		return _.has(this._rules, rule);
	}

	public addRule(rule: string, validator:Validator): void {
		if(this.hasRule(rule)) {
			throw new ArgumentException('rule:' + rule + ' has already exist');
		}

		this._rules[rule] = validator;
	}

	public removeRule(rule: string): boolean {
		return delete this._rules[rule]
	}

	public getValidator(rule: string): Validator {
		return this._rules[rule];
	}

	public validate(input: {}): ValidationResult{
		return new ValidationResult(this._fields, input);
	}

	public addField(name: string): Field<Field<any>>{
		return this.insertField(-1, name);
	}

	public insertField(idx: number, name: string): Field<Field<any>> {
		if(idx < 0) {
			idx = this._fields.length + idx + 1;
		}
		if(this.findField(name) >= 0) {
			throw new ArgumentException('name', 'field "' + name + '" is already exists.');
		}
		var field = new Field(this, name);
		this._fields.splice(idx, 0, field);
		return field;
	}

	private findField(name: string) {
		return Enumerable
			.from(this._fields)
			.indexOf(field => field.name == name);
	}
}

export = Form;