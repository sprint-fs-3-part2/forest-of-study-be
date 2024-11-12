import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudiesModule } from './studies/studies.module';
import { HabitsModule } from './habits/habits.module';
import { PointsModule } from './points/points.module';
import { ReactionsModule } from './reactions/reactions.module';

@Module({
  imports: [StudiesModule, HabitsModule, PointsModule, ReactionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
