import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({name: 'choise', async: false})
export class ChoiseValidation implements ValidatorConstraintInterface {
    validate(value: string, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
        if ('ROLE_USER' === value.toUpperCase() || 'ROLE_ADMIN' === value.toUpperCase()) {
            return true;
        }

        return false;
    }

    defaultMessage?(validationArguments?: ValidationArguments): string {
        return 'Choose a valid role';
    }
}