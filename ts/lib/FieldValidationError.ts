import Field = require('./Field');

interface FieldValidationError {
	field: Field<any>;
	rule: string;
	value: any;
	arguments:any[];
}

export = FieldValidationError;