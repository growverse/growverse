import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserPreferencesDto {
  @ApiProperty({ required: false, type: String })
  language?: string;

  @ApiProperty({ required: false, type: String })
  timezone?: string;

  @ApiProperty({ required: false, enum: ['low', 'medium', 'high'] })
  graphics?: 'low' | 'medium' | 'high';

  @ApiProperty({ required: false, type: Number })
  audioVolume?: number;

  @ApiProperty({ required: false, type: Boolean })
  micEnabled?: boolean;

  @ApiProperty({ required: false, type: Boolean })
  chatEnabled?: boolean;
}
