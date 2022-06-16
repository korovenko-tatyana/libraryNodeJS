import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

export enum StateEnum {
    NEW = "new",
    MEDIUM = "medium",
    BAD = "bad",
    RELIC = 'relic',
}

@ValidatorConstraint({name: 'state', async: false})
export class StateValidation implements ValidatorConstraintInterface {
    validate(value: string, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
        
        if (value.toUpperCase() in StateEnum) {
            return true;
        }

        return false;
    }

    defaultMessage?(validationArguments?: ValidationArguments): string {
        return 'Choose a valid state';
    }
}