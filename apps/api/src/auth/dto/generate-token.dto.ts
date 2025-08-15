import { ApiProperty } from '@nestjs/swagger';

export class GenerateTokenDto {
  @ApiProperty()
  username!: string;

  @ApiProperty()
  password!: string;
}
