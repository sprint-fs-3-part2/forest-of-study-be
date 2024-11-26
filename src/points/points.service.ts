import { Injectable } from '@nestjs/common';
import { CreatePointDto } from './dto/create-point.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PointsService {
  // PrismaService를 주입
  constructor(private readonly prisma: PrismaService) {}

  async updatePoint(createPointDto: CreatePointDto) {
    const { studyId, points } = createPointDto;

    // studyId로 기존 레코드를 조회
    const existingFocus = await this.prisma.focus.findUnique({
      where: { studyId },
    });

    // 기존 레코드가 있으면 포인트를 더해줌
    if (existingFocus) {
      const point = await this.prisma.focus.update({
        where: { studyId },
        data: { points: existingFocus.points + points },
      });

      return point;
    }
  }
}
