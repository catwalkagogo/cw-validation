// Type definitions for validator
// Project: https://github.com/ctavan/validator

declare module "validator" {
	module Validator {
		export interface IsUrlOption {
			protocols?: string[];
			require_tld?: boolean;
			require_protocol?: boolean;
		}

		export interface InOptions {
			indexOf(value: any): number;
		}
	}

	interface Validator {
		extend(name: string, fn: Function): void;
		toString(input: any): string;
		toDate(date: any): Date;
		toFloat(str: string): Number;
		toInt(str: string, radix: number): Number;
		toBoolean(str: string, strict: boolean): boolean;
		equals(str: string, comparison: any): boolean;
		contains(str: string, elem: any): boolean;
		matches(str: string, pattern: string, modifiers: string): boolean;
		isEmail(str: string): boolean;
		isURL(str: string, options: Validator.IsUrlOption): boolean;
		isIP(str: string, version): boolean;
		isAlpha(str: string): boolean;
		isAlphanumeric(str: string): boolean;
		isNumeric(str: string): boolean;
		isHexadecimal(str: string): boolean;
		isHexColor(str: string): boolean;
		isLowercase(str: string): boolean;
		isUppercase(str: string): boolean;
		isInt(str: string): boolean;
		isFloat(str: string): boolean;
		isDivisibleBy(str: string, num: number): boolean;
		isNull(str: string): boolean;
		isLength(str: string, min: number, max: number): boolean;
		isByteLength(str: string, min: number, max: number): boolean;
		isUUID(str: string, version?: string): boolean;
		isDate(str: string): boolean;
		isAfter(str: string, date: Date): boolean;
		isAfter(str: string, date: string): boolean;
		isBefore(str: string, date: Date): boolean;
		isBefore(str: string, date: string): boolean;
		isIn(str: string, options: any[]): boolean;
		isIn(str: string, options: Validator.InOptions): boolean;
		isCreditCard(str: string): boolean;
		isISBN(str: string, version?: string): boolean;
		isJSON(str: string): boolean;
		isMultibyte(str: string): boolean;
		isAscii(str: string): boolean;
		isFullWidth(str: string): boolean;
		isHalfWidth(str: string): boolean;
		isVariableWidth(str: string): boolean;
		isSurrogatePair(str: string): boolean;
		isBase64(str: string): boolean;
		ltrim(str: string, chars?: any[]): string;
		rtrim(str: string, chars?: any[]): string;
		trim(str: string, chars?: any[]): string;
		escape(str: string): string;
		stripLow(str: string, keep_new_lines): string;
		whitelist(str: string, chars?: any[]): string;
		blacklist(str: string, chars?: any[]): string;
	}

	var Validator: {
		extend(name: string, fn: Function): void;
		toString(input: any): string;
		toDate(date: any): Date;
		toFloat(str: string): Number;
		toInt(str: string, radix: number): Number;
		toBoolean(str: string, strict: boolean): boolean;
		equals(str: string, comparison: any): boolean;
		contains(str: string, elem: any): boolean;
		matches(str: string, pattern: string, modifiers: string): boolean;
		isEmail(str: string): boolean;
		isURL(str: string, options: Validator.IsUrlOption): boolean;
		isIP(str: string, version): boolean;
		isAlpha(str: string): boolean;
		isAlphanumeric(str: string): boolean;
		isNumeric(str: string): boolean;
		isHexadecimal(str: string): boolean;
		isHexColor(str: string): boolean;
		isLowercase(str: string): boolean;
		isUppercase(str: string): boolean;
		isInt(str: string): boolean;
		isFloat(str: string): boolean;
		isDivisibleBy(str: string, num: number): boolean;
		isNull(str: string): boolean;
		isLength(str: string, min: number, max: number): boolean;
		isByteLength(str: string, min: number, max: number): boolean;
		isUUID(str: string, version?: string): boolean;
		isDate(str: string): boolean;
		isAfter(str: string, date: Date): boolean;
		isAfter(str: string, date: string): boolean;
		isBefore(str: string, date: Date): boolean;
		isBefore(str: string, date: string): boolean;
		isIn(str: string, options: any[]): boolean;
		isIn(str: string, options: Validator.InOptions): boolean;
		isCreditCard(str: string): boolean;
		isISBN(str: string, version?: string): boolean;
		isJSON(str: string): boolean;
		isMultibyte(str: string): boolean;
		isAscii(str: string): boolean;
		isFullWidth(str: string): boolean;
		isHalfWidth(str: string): boolean;
		isVariableWidth(str: string): boolean;
		isSurrogatePair(str: string): boolean;
		isBase64(str: string): boolean;
		ltrim(str: string, chars?: any[]): string;
		rtrim(str: string, chars?: any[]): string;
		trim(str: string, chars?: any[]): string;
		escape(str: string): string;
		stripLow(str: string, keep_new_lines): string;
		whitelist(str: string, chars?: any[]): string;
		blacklist(str: string, chars?: any[]): string;
	}

	export = Validator;
}
