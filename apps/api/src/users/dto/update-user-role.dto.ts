import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRoleDto {
  @ApiProperty({ enum: ['admin', 'instructor', 'learner'] })
  role!: 'admin' | 'instructor' | 'learner';

  @ApiProperty()
  subRole!: string;
}
