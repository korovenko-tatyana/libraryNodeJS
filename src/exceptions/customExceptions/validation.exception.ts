import { HttpException, HttpStatus } from "@nestjs/common";

export class ValidationExcepton extends HttpException {
    messages: any;
    success: boolean;

    constructor(response: string | Record<string, any>) {
        super(response, HttpStatus.BAD_REQUEST);
        this.success = false;
        this.messages = response;
    }
}