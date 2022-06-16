import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({name: 'fromVal', async: false})
export class LimitValidation implements ValidatorConstraintInterface {
    validate(value: number, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
        const arr = [10, 20, 50, 100];
        
        if (arr.includes(value)) {
            return true;
        }

        return false;
    }

    defaultMessage?(validationArguments?: ValidationArguments): string {
        return 'Choose a valid limit parameter: 10, 20, 50 or 100';
    }
}