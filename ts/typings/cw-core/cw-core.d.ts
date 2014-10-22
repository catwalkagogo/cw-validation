declare module "cw-core" {

// ts/lib/Accessor.d.ts
class Accessor {
    private _data;
    constructor(data?: Object);
    public access(): any;
    public access(key: string): any;
    public access(key: string, value: any): void;
    public access(data: Object): void;
}

// ts/lib/ArgumentException.d.ts
class ArgumentException extends Exception {
    constructor(varName: string, extraMessage?: string);
}

// ts/lib/ArgumentNullException.d.ts
class ArgumentNullException extends Exception {
    constructor(varName: string);
}

// ts/lib/Arr.d.ts
class Arr {
    static get(array: any[], key: any, defaultValue?: any): any;
}

// ts/lib/Class.d.ts
class Class {
    static getClassName(obj: Object): string;
    static getFunctionName(func: Function): string;
    static getFunctionNames(obj: Object): string[];
}

// ts/lib/Exception.d.ts
class Exception implements Error {
    private _name;
    private _message;
    constructor(message: string);
    public name : string;
    public message : string;
}

}
