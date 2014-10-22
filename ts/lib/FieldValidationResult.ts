import FieldValidationError = require('./FieldValidationError');
interface FieldValidationResult {
	hasError: boolean;
	error?: FieldValidationError;
	validatedValue: any;
}

export = FieldValidationResult;