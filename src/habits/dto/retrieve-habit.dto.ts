import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsString, IsUUID } from 'class-validator';
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
  @Type(() => Date)
  completedAt: Date;
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
  @IsBoolean()
  completedToday: boolean;

  @ApiProperty({
    description: '습관이 생성된 날짜',
    example: '2024-11-21T15:30:00Z',
  })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  static of(params: {
    habit: HabitData;
    completedHabits: CompletedHabitData[];
  }): HabitResponseDto {
    const { habit, completedHabits } = params;

    return {
      id: habit.id,
      name: habit.name,
      completedToday: completedHabits.some((el) => {
        const today = new Date();
        const completedDate = new Date(el.completedAt);
        return (
          completedDate.getFullYear() === today.getFullYear() &&
          completedDate.getMonth() === today.getMonth() &&
          completedDate.getDate() === today.getDate()
        );
      }),
      completedHabitsThisWeek: completedHabits.map((el) => ({
        id: el.id,
        studyId: el.studyId,
        habitId: el.habitId,
        completedAt: el.completedAt,
      })),
      createdAt: habit.createdAt,
    };
  }
}

export class StudyHabitsResponseDto {
  @ApiProperty({
    description: '스터디의 모든 습관 목록',
    type: [HabitResponseDto],
  })
  habits: HabitResponseDto[];

  static of(params: {
    habits: HabitData[];
    completedHabits: CompletedHabitData[];
  }): StudyHabitsResponseDto {
    const { habits, completedHabits } = params;

    return {
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
