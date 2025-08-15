import { ApiProperty } from '@nestjs/swagger';
import { UserPreferences } from '../domain/value-objects/preferences/preferences.types.js';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  username?: string;

  @ApiProperty({ required: false })
  displayName?: string;

  @ApiProperty({ required: false })
  avatarUrl?: string;

  @ApiProperty({ required: false, enum: ['admin', 'instructor', 'learner'] })
  role?: 'admin' | 'instructor' | 'learner';

  @ApiProperty({ required: false })
  subRole?: string;

  @ApiProperty({ required: false, type: Object })
  preferences?: Partial<UserPreferences>;
}
