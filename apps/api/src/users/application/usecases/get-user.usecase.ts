import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.js';
import { User } from '../../domain/entities/user.entity.js';
import { UserRepository } from '../../infrastructure/mongo/user.repository.js';

@Injectable()
export class GetUserUseCase {
  constructor(@Inject(UserRepository) private readonly repo: IUserRepository) {}

  execute(id: string): Promise<User | null> {
    return this.repo.findById(id);
  }
}
