import { ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { User } from 'src/user/user.model';
import { ROLES_KEY } from './roles-auth.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector) {
        super()
      }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        let user:User;
        const req = context.switchToHttp().getRequest();
        try {
            const token = req.headers?.authorization?.split(' ')[1];
            user = this.jwtService.verify(token);
        } catch (e) {
            throw new UnauthorizedException();
        }
        
        if (true !== user.active) {
            throw new HttpException('Forbidden: not active user', HttpStatus.FORBIDDEN);
        }

         const requiredRoles = this.reflector.getAllAndOverride<string>(ROLES_KEY, [
             context.getHandler(),
             context.getClass(),
         ]);

         if (!requiredRoles) {
            return true;
        }
        
        req.user = user;
        if (true !== user.role.includes(requiredRoles)) {
            throw new HttpException(`Access denied`, HttpStatus.FORBIDDEN);
        }
        
        return true;
    }
}