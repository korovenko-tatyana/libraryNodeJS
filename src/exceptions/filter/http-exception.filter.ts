import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        let message = exception.getResponse();
        
        if ((typeof message === 'object') && ('message' in message)) {
            message = message.message;
        }
        
            response
              .status(status)
              .json({
                success: false,
                statusCode: status,
                message: message,
                timestamp: new Date().toISOString(),
                path: request.url,
              });        
    }
}
