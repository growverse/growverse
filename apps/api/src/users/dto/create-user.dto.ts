import { ApiProperty } from '@nestjs/swagger';
import { UserPreferences } from '../domain/value-objects/preferences/preferences.types.js';

export class CreateUserDto {
  @ApiProperty()
  email!: string;

  @ApiProperty()
  username!: string;

  @ApiProperty({ required: false })
  displayName?: string;

  @ApiProperty({ required: false })
  avatarUrl?: string;

  @ApiProperty({ enum: ['admin', 'instructor', 'learner'] })
  role!: 'admin' | 'instructor' | 'learner';

  @ApiProperty()
  subRole!: string;

  @ApiProperty({ required: false, type: Object })
  preferences?: Partial<UserPreferences>;
}
