import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangeStatusUserDto } from './dto/change-status-user.dto';
import { GetListUserDto } from './dto/get-list-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserEntity } from '../classWithoutSomeProperty/user-entity.class';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>,
    private jwtttt: JwtAuthGuard) {}
      
    async add(createUserDto: CreateUserDto) {
        await this.checkExistEmailAndPhone(createUserDto);

        const user = await this.save(createUserDto);
        //const user = await this.usersRepository.save({...createUserDto, password: hashPassword});

        //delete(user.password);
        return new UserEntity(user);
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> | never {
        const user = await this.checkNotExistUser('id', id);
        
        if (user.email !== updateUserDto.email) {
            await this.checkAlreadyExistUser('email', updateUserDto.email);
        }

        if (user.phone !== updateUserDto.phone) {
            await this.checkAlreadyExistUser('phone', updateUserDto.phone);
        }

        return await this.editUser(user, updateUserDto);
    }

    async get(id: string) {
        return new UserEntity(await this.checkNotExistUser('id', id));
    }

    async delete(id: string) {
        const user = await this.checkNotExistUser('id', id);

        await this.usersRepository.remove(user);
    }

    async changeStatus(id: string, changeStatusUserDto: ChangeStatusUserDto) {
        const user = await this.checkNotExistUser('id', id);
        this.checkStatus(user.active, changeStatusUserDto.active);
        
        if (false === changeStatusUserDto.active) {
            user.deativatedAt = new Date();
        } else {
            user.deativatedAt = null;
        }

        user.active = changeStatusUserDto.active;
        return new UserEntity(await this.usersRepository.save(user));
    }

    async getAll(getListUserDto: GetListUserDto) {
        const [list, totalCount] = await this.findAllUsers(getListUserDto);
        const pagination = {
            totalCount: totalCount,
            selected: list.length,
            from: getListUserDto.from
        }
        const listUsers = [];

        for (let key in list) {
             listUsers[key] = new UserEntity(list[key]);
        }
        
        return [listUsers, pagination];
    }

    async findAllUsers(getListUserDto: GetListUserDto) {
        const qr = this.usersRepository
        .createQueryBuilder('user')
        .take(getListUserDto.limit)
        .skip(getListUserDto.from)
        
        const arrKey = ['fio', 'email', 'phone'];
        
        for (let key in getListUserDto) {
            if (true === arrKey.includes(key)) {
                if ('' === getListUserDto[key]) {
                    qr.andWhere(`user.${key} IS NULL`)
                } else if(undefined !== getListUserDto[key]) {
                    qr.andWhere(`lower(user.${key}) like :${key}`)
                    .setParameter(`${key}`, `%${getListUserDto[key].toLowerCase()}%`)
                }
            } 
        }

        if (undefined !== getListUserDto.active) {
            qr.andWhere('user.active = :active', {active: getListUserDto.active})
        }

        if (undefined !== getListUserDto.role) {
            qr.andWhere('user.role = :role', {role: getListUserDto.role})
        }

        return qr.getManyAndCount();
    }

    async checkExistEmailAndPhone(createUserDto: CreateUserDto) {
         await this.checkAlreadyExistUser('email', createUserDto.email);

         if (null !== createUserDto.phone) {
            await this.checkAlreadyExistUser('phone', createUserDto.phone);
         }
    }

    async findByParam(nameOfField: string, param: string) {
        return await this.usersRepository
        .createQueryBuilder('user')
        .where(`user.${nameOfField} = :param`, {param: param})
        .getOne()
    }

    async checkAlreadyExistUser(nameOfField: string, param: string) {
        const findUser = await this.findByParam(nameOfField, param);

        if (undefined !== findUser) {
            throw new HttpException(`User with ${nameOfField} ${param} already exist`, HttpStatus.BAD_REQUEST);
        }
    }

    async checkNotExistUser(nameOfField: string, param: string) {
        const findUser = await this.findByParam(nameOfField, param);

        if (undefined === findUser) {
            throw new HttpException(`User with ${nameOfField} ${param} not found`, HttpStatus.NOT_FOUND);
        } else {
            return findUser;
        }
    }

    async save(createUserDto: CreateUserDto) {
        const user = new User();
        user.email = createUserDto.email;
        user.fio = createUserDto.fio;
        user.password = await bcrypt.hash(createUserDto.password, 5);
        user.phone = createUserDto.phone;
        user.active = true;
        user.role = this.getRoles(createUserDto.role);
        user.updatedAt = null;
        user.deativatedAt = null;

        return await this.usersRepository.save(user);
    }

    async editUser(user: User, updateUserDto: UpdateUserDto) {
        user.fio = updateUserDto.fio ?? user.fio;
        user.email = updateUserDto.email ?? user.email;
        user.phone = updateUserDto.phone ?? user.phone;
        user.role = this.changeRoles(updateUserDto.role) ?? user.role;
        
        return await this.usersRepository.save(user);
    }

    async getUserByEmail(email: string) {
        const user = await this.usersRepository.findOne({where: {email}})
        
        return user;
    }

    checkStatus(currentStatus: boolean, newStatus: boolean) {
        if (currentStatus === newStatus) {
            const status = (true === newStatus) ? 'active' : 'inactive';

            throw new HttpException(`User already has ${status} status`, HttpStatus.BAD_REQUEST);
        }
    }

    getRoles(role: string) {
        const arrRoles = [];
        
        if (undefined !== role) {
            arrRoles.push(role.toUpperCase());
        }

        if ('ROLE_ADMIN' === role || undefined === role) {
            arrRoles.push('ROLE_USER');
        }
      
        return arrRoles;
      }

      changeRoles(role: string): undefined | Array<string> {
        if (undefined === role) {
            return undefined;
        }

        const arrRoles = [];
        arrRoles.push(role.toUpperCase());

        if ('ROLE_ADMIN' === role) {
            arrRoles.push('ROLE_USER');
        }
        
        return arrRoles;
      }
}
