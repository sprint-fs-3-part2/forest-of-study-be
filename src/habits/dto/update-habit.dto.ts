import { CreateHabitResponseDto } from './create-habit.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsString,
  IsUUID,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateHabitDto {
  @ApiProperty({
    description: '습관 ID',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: '수정할 습관 이름',
    example: '물 2L 마시기',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  name: string;
}

export class UpdateHabitsDto {
  @ApiProperty({
    description: '수정할 습관 목록',
    type: [UpdateHabitDto],
  })
  @ValidateNested({ each: true })
  @Type(() => UpdateHabitDto)
  @ArrayMinSize(1)
  habits: UpdateHabitDto[];
}

export class UpdateHabitsResponseDto {
  @ApiProperty({
    description: '수정된 습관 목록',
    type: [CreateHabitResponseDto],
  })
  habits: CreateHabitResponseDto[];

  static of(habits: any[]): UpdateHabitsResponseDto {
    return {
      habits: habits.map((habit) =>
        CreateHabitResponseDto.of({
          id: habit.id,
          name: habit.name,
          studyId: habit.studyId,
          createdAt: habit.createdAt,
        }),
      ),
    };
  }
}
