import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { StudyHabitsResponseDto } from './dto/retrieve-habit.dto';
import { ApiCustomDocs } from 'src/shared/swagger/ApiCustomDocs';
import { ApiTags } from '@nestjs/swagger';

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
          description: '스터디 ID',
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
}
