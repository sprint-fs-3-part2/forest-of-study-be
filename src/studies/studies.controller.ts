import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StudiesService } from './studies.service';
import { CreateStudyDto, CreateStudyResponseDto } from './dto/create-study.dto';
import { UpdateStudyDto } from './dto/update-study.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiCustomDocs } from '../shared/swagger/ApiCustomDocs';
import { QueryParamsDto } from './dto/retreive-study.dto';

@ApiTags('studies')
@Controller('studies')
export class StudiesController {
  constructor(private readonly studiesService: StudiesService) {}

  @ApiCustomDocs({
    summary: '스터디 생성',
    description: {
      title: '스터디를 생성합니다.',
      contents: [
        '스터디 이름, 스터디 개설자 닉네임, 스터디 소개, 배경화면, 비밀번호를 입력받아 스터디를 생성합니다.',
      ],
    },
    requestType: CreateStudyDto,
    responseType: CreateStudyResponseDto,
  })
  @Post()
  create(@Body() createStudyDto: CreateStudyDto) {
    return this.studiesService.createStudy(createStudyDto);
  }

  @ApiCustomDocs({
    summary: '스터디 목록 조회',
    description: {
      title: '스터디 목록을 조회합니다.',
      contents: ['개설된 모든 스터디 목록을 조회합니다.'],
    },
    // requestType: QueryParamsDto,
    // responseType: createStudyResponseDto,
  })
  @Get()
  findStudies(@Body() queryParamsDto: QueryParamsDto) {
    return this.studiesService.findStudies(queryParamsDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudyDto: UpdateStudyDto) {
    return this.studiesService.update(+id, updateStudyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studiesService.remove(+id);
  }
}
