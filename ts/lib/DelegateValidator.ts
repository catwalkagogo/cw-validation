import ValidationArgs = require('./ValidationArgs');
import Validator = require('./Validator');

class DelegateValidator implements Validator{
	private _validator: (args: ValidationArgs) => any;

	public constructor(validator: (args: ValidationArgs) => any) {
		this._validator = validator;
	}

	public validate(args: ValidationArgs): any {
		return this._validator(args);
	}
}

export = DelegateValidator;