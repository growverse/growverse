import { Injectable } from '@nestjs/common';
import { UpdateUserRoleDto } from '../../dto/update-user-role.dto.js';
import { UserRepository } from '../../infrastructure/mongo/user.repository.js';

@Injectable()
export class UpdateUserRoleUseCase {
  constructor(private readonly repo: UserRepository) {}

  async execute(id: string, dto: UpdateUserRoleDto) {
    const user = await this.repo.findById(id);
    if (!user) return null;
    user.changeRole(dto.role, dto.subRole as any);
    return this.repo.update(user);
  }
}
