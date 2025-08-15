import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IUserRepository } from '../../domain/repositories/user.repository.js';
import { User } from '../../domain/entities/user.entity.js';
import { CreateUserDto } from '../../dto/create-user.dto.js';
import { UserRepository } from '../../infrastructure/mongo/user.repository.js';

@Injectable()
export class CreateUserUseCase {
  constructor(@Inject(UserRepository) private readonly repo: IUserRepository) {}

  async execute(dto: CreateUserDto): Promise<User> {
    const user = User.create(randomUUID(), dto as any);
    return this.repo.create(user);
  }
}
