import ValidationArgs = require('./ValidationArgs');

interface Validator {
	validate(args: ValidationArgs): any;
}

export = Validator;