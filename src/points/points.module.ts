import { Module } from '@nestjs/common';
import { PointsService } from './points.service';
import { PointsController } from './points.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PointsController],
  providers: [PointsService, PrismaService],
})
export class PointsModule {}
