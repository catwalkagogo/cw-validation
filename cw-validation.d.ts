declare module "cw-validation" {

// ts/lib/DelegateValidator.d.ts
class DelegateValidator implements Validator {
    private _validator;
    constructor(validator: (args: ValidationArgs) => any);
    public validate(args: ValidationArgs): any;
}

// ts/lib/Field.d.ts
class Field<TSelf extends Field<any>> {
    private _name;
    private _form;
    private _rules;
    constructor(form: IForm, name: string);
    public name : string;
    public addRule(rule: Validator, name?: string, ...args: any[]): TSelf;
    public addRule(rule: Function, ...args: any[]): TSelf;
    public addRule(rule: string, ...args: any[]): TSelf;
    public insertRule(idx: number, rule: Validator, name?: string, ...args: any[]): TSelf;
    public insertRule(idx: number, rule: Function, ...args: any[]): TSelf;
    public insertRule(idx: number, rule: string, ...args: any[]): TSelf;
    public removeRule(rule: any): TSelf;
    public validate(v: any, result?: ValidationResult): FieldValidationResult;
    private findRule(rule);
    public form : IForm;
}

// ts/lib/FieldValidationError.d.ts
interface FieldValidationError {
    field: Field<any>;
    rule: string;
    value: any;
    arguments: any[];
}

// ts/lib/FieldValidationResult.d.ts
interface FieldValidationResult {
    hasError: boolean;
    error?: FieldValidationError;
    validatedValue: any;
}

// ts/lib/Form.d.ts
class Form implements IForm {
    private static _baseRules;
    private static baseRules;
    private _rules;
    private _fields;
    constructor();
    public hasRule(rule: string): boolean;
    public addRule(rule: string, validator: Validator): void;
    public removeRule(rule: string): boolean;
    public getValidator(rule: string): Validator;
    public validate(input: {}): ValidationResult;
    public addField(name: string): Field<Field<any>>;
    public insertField(idx: number, name: string): Field<Field<any>>;
    private findField(name);
}

// ts/lib/IForm.d.ts
interface IForm {
    hasRule(rule: string): boolean;
    addRule(rule: string, validator: Validator): void;
    removeRule(rule: string): boolean;
    getValidator(rule: string): Validator;
    validate(input: {}): ValidationResult;
    addField(name: string): Field<Field<any>>;
    insertField(idx: number, name: string): Field<Field<any>>;
}

// ts/lib/ValidationArgs.d.ts
interface ValidationArgs {
    value: any;
    result: ValidationResult;
    form: IForm;
    parameters: any[];
}

// ts/lib/ValidationResult.d.ts
class ValidationResult {
    private _input;
    private _fields;
    private _results;
    private _hasError;
    constructor(fields: Field<any>[], input: {});
    public inputValue(): {};
    public inputValue(key: string): any;
    public validatedValue(): {};
    public validatedValue(key: string): any;
    public get(): {
        [key: string]: FieldValidationResult;
    };
    public get(key: string): FieldValidationResult;
    private ensureValidation(key);
    private ensureAll();
    public hasError : boolean;
    public success : boolean;
}

// ts/lib/Validator.d.ts
interface Validator {
    validate(args: ValidationArgs): any;
}

}
