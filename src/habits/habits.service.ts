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
}
