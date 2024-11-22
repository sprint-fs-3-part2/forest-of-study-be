import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';

@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @ApiCustomDocs({
    summary: '습관 생성',
    description: {
      title: '습관를 생성합니다.',
      contents: [
        // '스터디 이름, 스터디 개설자 닉네임, 스터디 소개, 배경화면, 비밀번호를 입력받아 스터디를 생성합니다.',
      ],
    },
    // requestType: CreateStudyDto,
    // responseType: CreateStudyResponseDto,
  })
  @Post()
  create(@Body() createHabitDto: CreateHabitDto) {
    return this.habitsService.create(createHabitDto);
  }

  @Get()
  findAll() {
    return this.habitsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.habitsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHabitDto: UpdateHabitDto) {
    return this.habitsService.update(+id, updateHabitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.habitsService.remove(+id);
  }
}
