import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.js';
import { UpdateUserPreferencesDto } from '../../dto/update-user-preferences.dto.js';
import { UserRepository } from '../../infrastructure/mongo/user.repository.js';

@Injectable()
export class UpdateUserPreferencesUseCase {
  constructor(@Inject(UserRepository) private readonly repo: IUserRepository) {}

  async execute(id: string, dto: UpdateUserPreferencesDto) {
    const user = await this.repo.findById(id);
    if (!user) return null;
    user.updatePreferences(dto);
    return this.repo.update(user);
  }
}
