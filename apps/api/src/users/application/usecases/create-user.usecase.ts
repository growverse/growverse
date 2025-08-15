import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { hash } from 'bcryptjs';
import { User } from '../../domain/entities/user.entity.js';
import { CreateUserDto } from '../../dto/create-user.dto.js';
import { UserRepository } from '../../infrastructure/mongo/user.repository.js';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly repo: UserRepository) {}

  async execute(dto: CreateUserDto): Promise<User> {
    const { password, ...rest } = dto;
    const passwordHash = await hash(password, 10);
    const user = User.create(randomUUID(), { ...rest, passwordHash } as any);
    return this.repo.create(user);
  }
}
