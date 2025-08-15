import { ApiProperty } from '@nestjs/swagger';

export class GenerateTokenDto {
  @ApiProperty()
  userId!: string;
}
