cw-validation
====

A form class for validation.

# Features

* Simple and extendable
* Lazy evaluation
	* Validations are run when it is needed.

# Rules

## Build-in rules from validator.js
+ [validator.js](https://github.com/chriso/validator.js)

## required

	addRule("required")

Check if the field input is not empty.

## requiredWith / requiredWithAll

	addRule("requiredWith", fields...)

Check if the field input is not empty when specified field(s) is/are not empty.

If multiple fields are specified, check this field when all specified fields are not empty.

### `fields...`
+ when `string`
    + Other field name
+ when `Function` : `(args: ValidationArgs) => any`
    + Callback function that returns whether the field is required or not.

## requiredWithAny

	addRule("requiredWithAny", fields...)

Check if the field input is not empty when specified field(s) is/are not empty.

If multiple fields are specified, check this field when there is at least one not empty field.

### `fields...`
+ when `string`
    + Other field name
+ when `Function` : `(args: ValidationArgs) => any`
    + Callback function that returns whether the field is required or not.

# References

See `cw-validation.d.ts`.

# Examples
