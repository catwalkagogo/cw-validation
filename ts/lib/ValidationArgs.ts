import ValidationResult = require('./ValidationResult');
import IForm = require('./IForm');

interface ValidationArgs{
	value: any;
	result: ValidationResult;
	form: IForm;
	parameters: any[];
}

export = ValidationArgs;