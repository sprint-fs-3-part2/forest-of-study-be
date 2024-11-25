import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { HabitsService } from './habits.service';
import { StudyHabitsResponseDto } from './dto/retrieve-habit.dto';
import { ApiCustomDocs } from 'src/shared/swagger/ApiCustomDocs';
import { ApiTags } from '@nestjs/swagger';
import {
  CompletedHabitResponseDto,
  CreateHabitsDto,
  CreateHabitsResponseDto,
} from './dto/create-habit.dto';
import {
  UpdateHabitsDto,
  UpdateHabitsResponseDto,
} from './dto/update-habit.dto';

@ApiTags('habits')
@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get(':studyId')
  @ApiCustomDocs({
    summary: '습관 조회',
    description: {
      title: '스터디에 등록된 습관을 조회합니다.',
      contents: ['현재 조회중인 스터디에 등록된 습관을 조회합니다.'],
    },
    requestType: {
      params: [
        {
          name: 'studyId',
          description: '조회할 스터디 ID',
          required: true,
          type: 'string',
          format: 'uuid',
        },
      ],
    },
    responseType: StudyHabitsResponseDto,
  })
  async getHabits(
    @Param('studyId', ParseUUIDPipe) studyId: string,
  ): Promise<StudyHabitsResponseDto> {
    return await this.habitsService.getHabits(studyId);
  }

  @Post(':studyId')
  @ApiCustomDocs({
    summary: '여러 습관 동시 생성',
    description: {
      title: '스터디에 여러 습관을 한번에 생성합니다.',
      contents: ['중복된 이름의 습관은 생성할 수 없습니다.'],
    },
    requestType: {
      params: [
        {
          name: 'studyId',
          description: '습관이 속한 스터디 ID',
          required: true,
          type: 'string',
          format: 'uuid',
        },
      ],
      body: CreateHabitsDto,
    },
    responseType: CreateHabitsResponseDto,
  })
  async createHabits(
    @Param('studyId', ParseUUIDPipe) studyId: string,
    @Body() createHabitsDto: CreateHabitsDto,
  ): Promise<CreateHabitsResponseDto> {
    return await this.habitsService.createHabits(studyId, createHabitsDto);
  }

  @Patch(':studyId')
  @ApiCustomDocs({
    summary: '여러 습관 동시 수정',
    description: {
      title: '스터디의 여러 습관을 한번에 수정합니다.',
      contents: ['중복된 이름의 습관으로 수정할 수 없습니다.'],
    },
    requestType: {
      params: [
        {
          name: 'studyId',
          description: '습관이 속한 스터디 ID',
          required: true,
          type: 'string',
          format: 'uuid',
        },
      ],
      body: UpdateHabitsDto,
    },
    responseType: UpdateHabitsResponseDto,
  })
  async updateHabits(
    @Param('studyId', ParseUUIDPipe) studyId: string,
    @Body() updateHabitsDto: UpdateHabitsDto,
  ): Promise<UpdateHabitsResponseDto> {
    return await this.habitsService.updateHabits(studyId, updateHabitsDto);
  }

  @Delete(':studyId/:habitId')
  @ApiCustomDocs({
    summary: '습관 삭제',
    description: {
      title: '스터디의 습관을 삭제합니다.',
    },
    requestType: {
      params: [
        {
          name: 'studyId',
          description: '습관이 속한 스터디 ID',
          required: true,
          type: 'string',
          format: 'uuid',
        },
        {
          name: 'habitId',
          description: '삭제할 습관 ID',
          required: true,
          type: 'string',
          format: 'uuid',
        },
      ],
    },
  })
  async deleteHabits(
    @Param('studyId', ParseUUIDPipe) studyId: string,
    @Param('habitId', ParseUUIDPipe) habitId: string,
  ): Promise<void> {
    await this.habitsService.deleteHabit(studyId, habitId);
  }

  @Post(':studyId/:habitId/complete')
  @ApiCustomDocs({
    summary: '습관 완료 처리',
    description: {
      title: '오늘의 습관을 완료 처리합니다.',
      contents: ['오늘 완료한 습관은 다시 완료할 수 없습니다.'],
    },
    requestType: {
      params: [
        {
          name: 'studyId',
          description: '습관이 속한 스터디 ID',
          required: true,
          type: 'string',
          format: 'uuid',
        },
        {
          name: 'habitId',
          description: '완료할 습관 ID',
          required: true,
          type: 'string',
          format: 'uuid',
        },
      ],
    },
    responseType: CompletedHabitResponseDto,
  })
  async completeHabit(
    @Param('studyId', ParseUUIDPipe) studyId: string,
    @Param('habitId', ParseUUIDPipe) habitId: string,
  ): Promise<CompletedHabitResponseDto> {
    return await this.habitsService.completeHabit(studyId, habitId);
  }

  @Delete(':studyId/:habitId/complete')
  @ApiCustomDocs({
    summary: '완료된 습관 삭제',
    description: {
      title: '완료된 습관을 삭제합니다.',
      contents: ['오늘 완료된 습관만 삭제할 수 있습니다.'],
    },
    requestType: {
      params: [
        {
          name: 'studyId',
          description: '삭제할 습관이 속한 스터디 ID',
          required: true,
          type: 'string',
          format: 'uuid',
        },
        {
          name: 'habitId',
          description: '삭제할 완료된 습관 ID',
          required: true,
          type: 'string',
          format: 'uuid',
        },
      ],
    },
  })
  async deleteCompletedHabit(
    @Param('studyId', ParseUUIDPipe) studyId: string,
    @Param('habitId', ParseUUIDPipe) habitId: string,
  ): Promise<void> {
    await this.habitsService.deleteCompletedHabit(habitId, studyId);
  }
}
