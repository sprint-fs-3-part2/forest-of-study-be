import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CompletedHabitResponseDto,
  CreateHabitsDto,
  CreateHabitsResponseDto,
} from './dto/create-habit.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  UpdateHabitsDto,
  UpdateHabitsResponseDto,
} from './dto/update-habit.dto';
import { StudyHabitsResponseDto } from './dto/retrieve-habit.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class HabitsService {
  constructor(private prisma: PrismaService) {}

  async createHabits(
    studyId: string,
    createHabitsDto: CreateHabitsDto,
  ): Promise<CreateHabitsResponseDto> {
    const study = await this.prisma.study.findUnique({
      where: { id: studyId },
    });

    if (!study) {
      throw new NotFoundException('스터디를 찾을 수 없습니다.');
    }

    const existingHabit = await this.prisma.habit.findMany({
      where: {
        studyId,
        name: { in: createHabitsDto.habits.map((habit) => habit.name) },
      },
    });

    if (existingHabit.length > 0) {
      throw new ConflictException(
        `이미 존재하는 습관이 있습니다: ${existingHabit.map((habit) => habit.name).join(', ')}`,
      );
    }

    const createdHabits = await this.prisma.$transaction(
      createHabitsDto.habits.map((habit) =>
        this.prisma.habit.create({
          data: {
            name: habit.name,
            studyId,
          },
        }),
      ),
    );

    return CreateHabitsResponseDto.of(createdHabits);
  }
  async updateHabits(
    studyId: string,
    updateHabitsDto: UpdateHabitsDto,
  ): Promise<UpdateHabitsResponseDto> {
    const existingHabits = await this.prisma.habit.findMany({
      where: {
        id: { in: updateHabitsDto.habits.map((h) => h.id) },
        studyId,
      },
    });

    if (existingHabits.length !== updateHabitsDto.habits.length) {
      throw new NotFoundException(
        '일부 습관을 찾을 수 없거나 해당 스터디에 속하지 않습니다.',
      );
    }

    const duplicateNames = await this.prisma.habit.findMany({
      where: {
        studyId,
        name: { in: updateHabitsDto.habits.map((habit) => habit.name) },
        id: { notIn: updateHabitsDto.habits.map((habit) => habit.id) },
      },
    });

    if (duplicateNames.length > 0) {
      throw new ConflictException(
        `이미 존재하는 습관 이름입니다: ${duplicateNames.map((habit) => habit.name).join(', ')}`,
      );
    }

    const updatedHabits = await this.prisma.$transaction(
      updateHabitsDto.habits.map((habit) =>
        this.prisma.habit.update({
          where: { id: habit.id },
          data: { name: habit.name },
        }),
      ),
    );

    return UpdateHabitsResponseDto.of(updatedHabits);
  }

  async getHabits(studyId: string): Promise<StudyHabitsResponseDto> {
    const study = await this.prisma.study.findUnique({
      where: { id: studyId },
    });

    if (!study) {
      throw new NotFoundException('스터디를 찾을 수 없습니다.');
    }

    try {
      const { startOfWeek, endOfWeek } = this.getWeekDateRange();

      const habits = await this.prisma.habit.findMany({
        where: { studyId },
        orderBy: {
          createdAt: 'asc',
        },
      });

      const completedHabits = await this.prisma.completedHabit.findMany({
        where: {
          studyId,
          completedAt: {
            gte: startOfWeek,
            lte: endOfWeek,
          },
        },
        orderBy: {
          completedAt: 'desc',
        },
      });

      return StudyHabitsResponseDto.of({
        habits,
        completedHabits,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new BadRequestException('습관 정보를 조회하는데 실패했습니다.');
      }
      throw error;
    }
  }

  async deleteHabit(studyId: string, habitId: string): Promise<void> {
    const existingHabits = await this.prisma.habit.findFirst({
      where: {
        studyId: studyId,
        id: habitId,
      },
    });

    if (!existingHabits)
      throw new NotFoundException('습관을 찾을 수 없습니다.');

    try {
      await this.prisma.$transaction([
        this.prisma.habit.delete({
          where: {
            id: habitId,
          },
        }),
      ]);
    } catch {
      throw new BadRequestException('습관 삭제에 실패했습니다.');
    }
  }

  async completeHabit(
    studyId: string,
    habitId: string,
  ): Promise<CompletedHabitResponseDto> {
    const habit = await this.prisma.habit.findFirst({
      where: { id: habitId, studyId: studyId },
    });

    if (!habit) {
      throw new NotFoundException('습관을 찾을 수 없습니다.');
    }

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const existingComplete = await this.prisma.completedHabit.findFirst({
      where: {
        studyId: studyId,
        habitId,
        completedAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (existingComplete) {
      throw new BadRequestException('이미 오늘 완료한 습관입니다.');
    }

    const completedHabit = await this.prisma.completedHabit.create({
      data: {
        habitId,
        studyId: habit.studyId,
        completedAt: new Date(),
      },
    });

    return CompletedHabitResponseDto.of(completedHabit);
  }

  async deleteCompletedHabit(habitId: string, studyId: string): Promise<void> {
    const habitToDelete = await this.prisma.completedHabit.findFirst({
      where: {
        studyId: studyId,
        habitId: habitId,
        completedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });
    if (!habitToDelete) throw new NotFoundException('습관을 찾을 수 없습니다.');

    await this.prisma.completedHabit.delete({
      where: { id: habitToDelete.id },
    });
  }

  private getWeekDateRange() {
    const today = new Date();
    const startOfWeek = new Date(today);

    const monday = today.getDay() === 0 ? -6 : 1 - today.getDay();

    startOfWeek.setDate(today.getDate() + monday);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(today);

    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return { startOfWeek, endOfWeek };
  }
}
