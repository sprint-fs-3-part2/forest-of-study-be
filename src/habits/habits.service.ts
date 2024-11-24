import {
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
  UpdateHabitsDto,
  UpdateHabitsResponseDto,
} from './dto/update-habit.dto';

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
}
