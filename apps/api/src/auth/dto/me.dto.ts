import { ApiProperty } from '@nestjs/swagger';

export class MeRequestDto {
  @ApiProperty({ required: false })
  token?: string;
}

export class MeDto {
  @ApiProperty()
  id!: string;

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

  @ApiProperty({ enum: ['active', 'inactive', 'banned'] })
  status!: 'active' | 'inactive' | 'banned';

  @ApiProperty({ required: false, type: Object })
  preferences?: {
    language: string;
    timezone: string;
    graphics: 'low' | 'medium' | 'high';
    audioVolume: number;
    micEnabled: boolean;
    chatEnabled: boolean;
  };

  @ApiProperty({ required: false })
  createdAt?: string;

  @ApiProperty({ required: false })
  updatedAt?: string;
}
