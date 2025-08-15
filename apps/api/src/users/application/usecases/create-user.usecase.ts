import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { User } from '../../domain/entities/user.entity.js';
import { CreateUserDto } from '../../dto/create-user.dto.js';
import { UserRepository } from '../../infrastructure/mongo/user.repository.js';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly repo: UserRepository) {}

  async execute(dto: CreateUserDto): Promise<User> {
    const user = User.create(randomUUID(), dto as any);
    return this.repo.create(user);
  }
}
