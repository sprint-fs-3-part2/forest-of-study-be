import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsString,
  MinLength,
  ValidateNested,
  IsUUID,
  IsDate,
} from 'class-validator';
import { CompletedHabitData, HabitData } from 'src/types/habit.types';

export class CreateHabitDto {
  @ApiProperty({
    description: '습관 이름',
    example: '물 1L 마시기',
    type: String,
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({
    description: '습관이 생성된 날짜',
    example: '',
    type: Date,
  })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;
}

export class CreateHabitsDto {
  @ApiProperty({
    description: '생성할 습관 목록',
    type: [CreateHabitDto],
    example: [{ name: '물 1L 마시기' }, { name: '운동하기' }],
  })
  @ValidateNested({ each: true })
  @Type(() => CreateHabitDto)
  @ArrayMinSize(1)
  habits: CreateHabitDto[];
}

export class CreateHabitResponseDto extends CreateHabitDto {
  @ApiProperty({
    description: '습관 ID (UUIDv4)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsString()
  @IsUUID(4)
  id: string;

  static of(params: {
    id: string;
    name: string;
    studyId: string;
    createdAt: Date;
  }): CreateHabitResponseDto {
    const dto = new CreateHabitResponseDto();
    return Object.assign(dto, params);
  }
}

export class CreateHabitsResponseDto {
  @ApiProperty({
    description: '생성된 습관 목록',
    type: [CreateHabitResponseDto],
  })
  habits: CreateHabitResponseDto[];

  static of(habits: HabitData[]): CreateHabitsResponseDto {
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

export class CompletedHabitResponseDto {
  @ApiProperty({
    description: '완료된 습관 ID (UUIDv4)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID(4)
  id: string;
  @ApiProperty({
    description: '습관 ID (UUIDv4)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID(4)
  habitId: string;
  @ApiProperty({
    description: '완료된 시점',
    example: '2024-11-21T15:30:00Z',
    format: 'date',
  })
  @IsDate()
  @Type(() => Date)
  completedAt: Date;
  static of(completedHabit: CompletedHabitData): CompletedHabitResponseDto {
    return {
      id: completedHabit.id,
      habitId: completedHabit.habitId,
      completedAt: completedHabit.completedAt,
    };
  }
}
