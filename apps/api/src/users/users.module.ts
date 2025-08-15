import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller.js';
import { UserSchema } from './infrastructure/mongo/user.model.js';
import { UserRepository } from './infrastructure/mongo/user.repository.js';
import { CreateUserUseCase } from './application/usecases/create-user.usecase.js';
import { GetUserUseCase } from './application/usecases/get-user.usecase.js';
import { UpdateUserUseCase } from './application/usecases/update-user.usecase.js';
import { DeleteUserUseCase } from './application/usecases/delete-user.usecase.js';
import { UpdateUserPreferencesUseCase } from './application/usecases/update-user-preferences.usecase.js';
import { UpdateUserRoleUseCase } from './application/usecases/update-user-role.usecase.js';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [UsersController],
  providers: [
    UserRepository,
    CreateUserUseCase,
    GetUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    UpdateUserPreferencesUseCase,
    UpdateUserRoleUseCase,
  ],
})
export class UsersModule {}
