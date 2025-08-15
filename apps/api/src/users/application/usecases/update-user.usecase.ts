import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.js';
import { UpdateUserDto } from '../../dto/update-user.dto.js';
import { User } from '../../domain/entities/user.entity.js';
import { UserRepository } from '../../infrastructure/mongo/user.repository.js';

@Injectable()
export class UpdateUserUseCase {
  constructor(@Inject(UserRepository) private readonly repo: IUserRepository) {}

  async execute(id: string, dto: UpdateUserDto): Promise<User | null> {
    const existing = await this.repo.findById(id);
    if (!existing) return null;
    const snap = existing.snapshot;
    const merged = {
      ...snap,
      ...dto,
      preferences: dto.preferences ? { ...snap.preferences, ...dto.preferences } : snap.preferences,
      role: dto.role ?? snap.role,
      subRole: dto.subRole ?? snap.subRole,
    };
    const updated = User.create(id, merged as any);
    return this.repo.update(updated);
  }
}
