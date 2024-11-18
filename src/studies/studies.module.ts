import { Module } from '@nestjs/common';
import { StudiesService } from './studies.service';
import { StudiesController } from './studies.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [StudiesController],
  providers: [StudiesService, PrismaService],
})
export class StudiesModule {}
