import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString, IsUUID } from 'class-validator';
import { CompletedHabitData, HabitData } from 'src/types/habit.types';

class CompletedHabitDto {
  @ApiProperty({
    description: '완료된 습관 ID',
    format: 'uuid',
  })
  @IsUUID(4)
  id: string;

  @ApiProperty({
    description: '습관 ID',
    format: 'uuid',
  })
  @IsUUID(4)
  habitId: string;

  @ApiProperty({
    description: '완료 날짜',
    example: '2024-11-21T15:30:00Z',
  })
  @IsDate()
  completedDate: Date;
}

class HabitResponseDto {
  @ApiProperty({
    description: '습관 ID',
    example: 'ddb61bbb-2049-402a-a212-d7492ae60b53',
    format: 'uuid',
  })
  @IsUUID(4)
  id: string;

  @ApiProperty({
    description: '습관 이름',
    example: '물 1L 마시기',
    format: 'string',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '이번 주 완료 기록 목록',
    type: [CompletedHabitDto],
  })
  completedHabitsThisWeek: CompletedHabitDto[];

  @ApiProperty({
    description: '오늘 습관 완료 여부',
    example: true,
    format: 'boolean',
  })
  @IsString()
  completedToday: boolean;

  @ApiProperty({
    description: '습관이 생성된 날짜',
    example: '2024-11-21T15:30:00Z',
  })
  @IsDate()
  createdAt: Date;

  static of(params: {
    habit: HabitData;
    completedHabits: CompletedHabitData[];
  }): HabitResponseDto {
    const { habit, completedHabits } = params;

    return {
      id: habit.id,
      name: habit.name,
      completedToday: completedHabits.some(
        (el) => el.completedAt.toDateString() === new Date().toDateString(),
      ),
      completedHabitsThisWeek: completedHabits.map((el) => ({
        id: el.id,
        studyId: el.studyId,
        habitId: el.habitId,
        completedDate: el.completedAt,
      })),
    };
  }
}

export class StudyHabitsResponseDto {
  @ApiProperty({
    description: '스터디 ID',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID(4)
  studyId: string;

  @ApiProperty({
    description: '스터디의 모든 습관 목록',
    type: [HabitResponseDto],
  })
  habits: HabitResponseDto[];

  static of(params: {
    studyId: string;
    habits: HabitData[];
    completedHabits: CompletedHabitData[];
  }): StudyHabitsResponseDto {
    const { studyId, habits, completedHabits } = params;

    return {
      studyId,
      habits: habits.map((habit) =>
        HabitResponseDto.of({
          habit,
          completedHabits: completedHabits.filter(
            (completed) => completed.habitId === habit.id,
          ),
        }),
      ),
    };
  }
}
