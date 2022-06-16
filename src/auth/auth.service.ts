import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private usersService: UserService,
        private jwtService: JwtService
        ) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.getUserByEmail(email);
        
        if (undefined !== user) {
            const passwordEquals = await bcrypt.compare(password, user.password);

            if (true === passwordEquals) {
                const {password, ...result} = user;
                return result;
            }
        }

        return null;
    }

    async login(user: any) {
        // const payload = { username: user.username, sub: user.userId };
        // return {
        //   access_token: this.jwtService.sign(payload),
        // };

        const payload = { email: user.email, id: user.id, role: user.role, active: user.active }
        
        return {
            access_token: this.jwtService.sign(payload)
        }
      }
}
