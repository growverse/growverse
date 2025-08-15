import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity.js';
import { UserRepository } from '../../infrastructure/mongo/user.repository.js';

@Injectable()
export class GetUserUseCase {
  constructor(private readonly repo: UserRepository) {}

  execute(id: string): Promise<User | null> {
    return this.repo.findById(id);
  }
}
