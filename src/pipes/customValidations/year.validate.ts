import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({name: 'fromVal', async: false})
export class YearValidatotion implements ValidatorConstraintInterface {
    validate(value: number, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
        if (0 <= value && 9999 >= value) {
            return true;
        }

        return false;
    }

    defaultMessage?(validationArguments?: ValidationArguments): string {
        return 'Enter a valid year';
    }
}
