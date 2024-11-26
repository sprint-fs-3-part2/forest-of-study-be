import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreatePointDto {
  @ApiProperty({
    nullable: false,
    description: '포인트 점수',
    example: 5,
    type: Number,
  })
  @IsNumber()
  points: number = 0;

  @ApiProperty({
    nullable: false,
    description: '스터디 아이디',
    example: '56afe5db-7938-4e93-8198-26c9f84e1335',
    type: String,
  })
  studyId: string;
}
