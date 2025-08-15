import { Injectable } from '@nestjs/common';
import { UpdateUserPreferencesDto } from '../../dto/update-user-preferences.dto.js';
import { UserRepository } from '../../infrastructure/mongo/user.repository.js';

@Injectable()
export class UpdateUserPreferencesUseCase {
  constructor(private readonly repo: UserRepository) {}

  async execute(id: string, dto: UpdateUserPreferencesDto) {
    const user = await this.repo.findById(id);
    if (!user) return null;
    user.updatePreferences(dto);
    return this.repo.update(user);
  }
}
