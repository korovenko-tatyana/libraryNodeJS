import { Test, TestingModule } from '@nestjs/testing';
import { randomInt } from 'crypto';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
    let controller: UserController;

    const mockUserService = {
        add: jest.fn((dto) => {
            return {
                success: true,
                result: {
                    id: randomInt(1, 100),
                    fio: dto.fio,
                    phone: dto.phone,
                    email: dto.email,
                    role: getRoles(dto.role),
                    active: true,
                    createdAt: Date.now(),
                    updatedAt: null,
                    deativatedAt: null
                }
            };
        }),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        controllers: [UserController],
        providers: [UserService]
        })
        .overrideProvider(UserService)
        .useValue(mockUserService)
        .compile();

        controller = module.get<UserController>(UserController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    
    it('should create a user', () => {
        const dto = {fio: 'Test test t', email: 'test@test.com', password: '123123123', phone: '8922222222', role: 'ROLE_USER'};
        expect(controller.create(dto)).toEqual({
            success: true,
            result: {
                id: expect.any(Number),
                fio: dto.fio,
                email: dto.email,
                phone: dto.phone,
                role: getRoles(dto.role),
                active: true,
                createdAt: expect.any(Number),
                updatedAt: null,
                deativatedAt: null
            }
        });

        expect(mockUserService.add).toHaveBeenCalledWith(dto);
    });
});

function getRoles(role: string) {
    const arrRoles = [];
    
    if (undefined !== role) {
        arrRoles.push(role.toUpperCase());
    }

    if ('ROLE_ADMIN' === role || undefined === role) {
        arrRoles.push('ROLE_USER');
    }
  
    return arrRoles;
  }