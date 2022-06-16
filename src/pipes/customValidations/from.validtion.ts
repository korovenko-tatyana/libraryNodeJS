import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({name: 'fromVal', async: false})
export class FromValidation implements ValidatorConstraintInterface {
    validate(value: number, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
        if (0 <= value) {
            return true;
        }

        return false;
    }

    defaultMessage?(validationArguments?: ValidationArguments): string {
        return 'Set a valid from parameter > 0';
    }
}