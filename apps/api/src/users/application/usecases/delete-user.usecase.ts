import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.js';
import { UserRepository } from '../../infrastructure/mongo/user.repository.js';

@Injectable()
export class DeleteUserUseCase {
  constructor(@Inject(UserRepository) private readonly repo: IUserRepository) {}

  async execute(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
