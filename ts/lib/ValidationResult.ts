import Core = require('cw-core');
import ArgumentNullException = Core.ArgumentNullException;

import FieldValidationResult = require('./FieldValidationResult');
import Field = require('./Field');
import _ = require('underscore');
import Enumerable = require('linq');

class ValidationResult{
	private _input: {};
	private _fields: { [key: string]: Field<any> };
	private _results: { [key: string]: FieldValidationResult } = {};
	private _hasError: boolean = null;

	public constructor(fields: Field<any>[], input: {}) {
		if(fields == null) {
			throw new ArgumentNullException('fields');
		}
		if(input == null) {
			throw new ArgumentNullException('input');
		}
		this._fields = Enumerable
			.from(fields)
			.toObject(field => field.name);
		this._input = input;
	}

	public inputValue(): {};
	public inputValue(key: string): any;
	public inputValue(key?: string): any {
		if(_.isUndefined(key)) {
			// return all
			return this._input;
		} else {
			return this._input[key];
		}
	}

	public validatedValue(): {};
	public validatedValue(key:string): any;
	public validatedValue(key?:string):any {
		if(_.isUndefined(key)) {
			// return all
			return Enumerable
				.from(this.ensureAll())
				.where(p => !p.value.hasError)
				.toObject(p => p.key, p => p.value.validatedValue);
		}else{
			var result = this.ensureValidation(key);
			if(!result.hasError) {
				return result.validatedValue;
			} else {
				return undefined;
			}
		}
	}

	public get(): { [key: string]: FieldValidationResult };
	public get(key: string): FieldValidationResult;
	public get(key?: string): any  {
		if(_.isUndefined(key)) {
			// return all
			return this.ensureAll();
		} else {
			return this.ensureValidation(key);
		}
	}

	private ensureValidation(key: string) : FieldValidationResult {
		if(_.has(this._results, key)) {
			return this._results[key];
		} else {
			var field = this._fields[key];
			var v = this._input[key];
			if(!_.isUndefined(field) && !_.isUndefined(v)) {
				//console.log('ensureValidation:' + key + " value:" + v);
				var result = field.validate(v, this);
				this._results[key] = result;
				return result;
			} else {
				return null;
			}
		}
	}

	private ensureAll(): { [key: string]: FieldValidationResult } {
		for(var key in this._input) {
			this.ensureValidation(key);
		}
		return this._results;
	}

	public get hasError(): boolean {
		if(this._hasError == null) {
			this._hasError = Enumerable
				.from(this.ensureAll())
				.any(result => result.value.hasError);
		}
		return this._hasError;
	}

	public get success(): boolean {
		return !this.hasError;
	}
}

export = ValidationResult;