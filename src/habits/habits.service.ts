import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateHabitsDto,
  CreateHabitsResponseDto,
} from './dto/create-habit.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  DeleteHabitsDto,
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

    const existingHabits = await this.prisma.habit.findMany({
      where: {
        studyId,
        name: { in: createHabitsDto.habits.map((habit) => habit.name) },
      },
    });

    if (existingHabits.length > 0) {
      throw new ConflictException(
        `이미 존재하는 습관이 있습니다: ${existingHabits.map((habit) => habit.name).join(', ')}`,
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
        studyId,
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

  async deleteHabits(
    studyId: string,
    deleteHabitsDto: DeleteHabitsDto,
  ): Promise<void> {
    const existingHabits = await this.prisma.habit.findMany({
      where: {
        studyId,
        name: { in: deleteHabitsDto.habits.map((habit) => habit.id) },
      },
    });

    if (existingHabits.length !== deleteHabitsDto.habits.length)
      throw new NotFoundException(
        '일부 습관을 찾을 수 없거나 해당 스터디에 속하지 않습니다.',
      );

    try {
      await this.prisma.$transaction([
        this.prisma.habit.deleteMany({
          where: {
            id: { in: deleteHabitsDto.habits.map((habit) => habit.id) },
            studyId,
          },
        }),
      ]);
    } catch (error) {
      throw new BadRequestException(
        `${error.message} 습관 삭제에 실패했습니다.`,
      );
    }
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
