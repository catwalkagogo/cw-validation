import Core = require('cw-core');
import Exception = Core.Exception;
import ArgumentNullException = Core.ArgumentNullException;
import ArgumentException = Core.ArgumentException;
import Arr = Core.Arr;

import Enumerable = require('linq');
import _ = require('underscore');

import IForm = require('./IForm');
import FieldValidationResult = require('./FieldValidationResult');
import FieldValidationError = require('./FieldValidationError');
import ValidationResult = require('./ValidationResult');
import ValidationArgs = require('./ValidationArgs');
import Validator = require('./Validator');

class Field<TSelf extends Field<any>>{
	private _name: string;
	private _form: IForm;
	private _rules: RuleObject[] = [];

	public constructor(form: IForm, name: string) {
		if(form == null) {
			throw new ArgumentNullException('form');
		}
		this._form = form;
		this.name = name;
	}

	public get name(): string {
		return this._name;
	}

	public set name(name: string) {
		this._name = name;
	}

	public addRule(rule: Validator, name?: string, ...args: any[]): TSelf;
	public addRule(rule: Function, ...args: any[]): TSelf;
	public addRule(rule: string, ...args: any[]): TSelf;
	public addRule(...args: any[]): TSelf {
		return this.insertRule.apply(this, [this._rules.length].concat(args));
	}

	public insertRule(idx: number, rule: Validator, name?: string, ...args: any[]): TSelf;
	public insertRule(idx: number, rule: Function, ...args: any[]): TSelf;
	public insertRule(idx: number, rule: string, ...args: any[]): TSelf;
	public insertRule(idx: number, rule: any, ...args: any[]): TSelf {
		if(idx < 0) {
			idx = this._rules.length + idx + 1;
		}
		if(_.isString(rule)) {
			//if(this._form.hasRule(rule)) {
				this._rules.splice(idx, 0, new RuleObject(rule, null, null, args));
			//} else {
			//	throw new ArgumentException('rule', 'Specified rule is not found.');
			//}
		} else if(!_.isUndefined(rule.validate)) {
			var name = Arr.get(args, 0, null);
			args = args.splice(0, 1);
			this._rules.splice(idx, 0, new RuleObject(name, null, rule, args));
		} else if(_.isFunction(rule)) {
			this._rules.splice(idx, 0, new RuleObject(null, rule, null, args));
		} else {
			throw new ArgumentException('rule', 'rule parameter must be string or function.');
		}		
		return <TSelf>this;
	}

	public removeRule(rule: any): TSelf {
		var idx;
		while((idx = this.findRule(rule)) >= 0) {
			delete this._rules[idx];
		}
		return <TSelf>this;
	}

	public validate(v: any, result?: ValidationResult): FieldValidationResult {
		var rules = Enumerable
			.from(this._rules);

		var error: FieldValidationError = null;
		var validated = true;
		var validatedValue = v;
		rules.forEach(rule => {
			if(validated) {

				//console.log('validate rule:' + rule.name + " value:\"" + validatedValue + "\"");

				var args = {
					value: validatedValue,
					result: result,
					parameters: rule.arguments,
					form: this._form,
				};
				var result = rule.validate(this, args);
				if(_.isBoolean(result)) {
					validated = validated && result;
					//console.log('validate rule:' + rule.name + " boolean:\"" + result + "\"");
				} else {
					validatedValue = result;
					//console.log('validate rule:' + rule.name + " filtered:\"" + validatedValue + "\"");
				}

				if(!validated) {
					//console.log('validate rule:' + rule.name + " error!");
					error = {
						field: this,
						rule: rule.name,
						value: validatedValue,
						arguments: rule.arguments,
					};
				}
			}
		});


		return {
			hasError: !validated,
			error: error,
			validatedValue: validatedValue,
		};
	}

	private findRule(rule: any) {
		if(_.isString(rule)) {
			return Enumerable
				.from(this._rules)
				.indexOf(v => v.name == rule);
		} else if(_.isFunction(rule)) {
			return Enumerable
				.from(this._rules)
				.indexOf(v => v.validator == rule);
		}
		return -1;
	}

	public get form(): IForm {
		return this._form;
	}
}

class RuleObject {
	name: string;
	function: Function;
	validator: Validator;
	arguments: any[];

	public constructor(name: string, func: Function, validator: Validator, arguments: any[]) {
		this.name = name;
		this.function = func;
		this.validator = validator;
		this.arguments = arguments;
	}

	validate(field:Field<any>, args: ValidationArgs) : any{
		if(this.function != null) {
			return this.function.apply(field, [args.value].concat(this.arguments));
		} else if(this.validator != null) {
			return this.validator.validate(args);
		} else {
			var validator = field.form.getValidator(this.name);
			if(!validator) {
				throw new Exception('Rule:' + this.name + " is not found.");
			}
			return validator.validate(args);
		}
	}
}

interface IRuleDelegate {
	name: string;
	self: any;
	func: Function;
	arguments: any[];
}

export = Field;