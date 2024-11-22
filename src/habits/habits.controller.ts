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
import { CreateHabitDto, CreateStudyResponseDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';

@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @ApiCustomDocs({
    summary: '오늘의 습관 조회',
    description: {
      title: '오늘의 습관을 조회합니다.',
      contents: [
        '현재 시간, 오늘의 습관 목록, 오늘의 집중 및 홈 버튼을 통해 오늘의 집중 페이지 및 스터디 홈으로 나갈 수 있습니다. 비밀번호를 입력하여 스터디 등록 시 입력했던 비밀번호와 일치할 경우, 오늘의 습관 조회',
      ],
    },
    requestType: CreateHabitDto,
    responseType: CreateStudyResponseDto,
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
