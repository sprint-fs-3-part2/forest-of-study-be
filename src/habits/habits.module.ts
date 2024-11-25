import { Module } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { HabitsController } from './habits.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [HabitsController],
  providers: [HabitsService, PrismaService],
})
export class HabitsModule {}
