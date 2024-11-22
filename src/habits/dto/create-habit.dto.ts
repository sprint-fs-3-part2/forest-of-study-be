import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateHabitDto {
  @ApiProperty({
    nullable: false,
    description: '',
    example: '',
    type: String,
  })
  
}
@ApiProperty({
  nullable: false,
  description: '',
  example: '',
  type: String,
})

