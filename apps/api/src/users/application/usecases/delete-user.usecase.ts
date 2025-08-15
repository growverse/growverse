import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/mongo/user.repository.js';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly repo: UserRepository) {}

  async execute(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
