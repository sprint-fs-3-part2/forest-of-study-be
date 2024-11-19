import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { StudiesService } from './studies.service';
import { CreateStudyDto, CreateStudyResponseDto } from './dto/create-study.dto';
import { UpdateStudyDto, UpdateStudyResponseDto } from './dto/update-study.dto';
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
    summary: '최근 조회한 스터디 목록 조회',
    description: {
      title: '최근 조회한 스터디 목록을 조회합니다.',
      contents: ['최근 조회한 스터디 목록을 조회합니다.'],
    },
  })
  @Get('recent')
  getRecentStudies() {
    return this.studiesService.getRecentStudies();
  }

  @ApiCustomDocs({
    summary: '스터디 목록 조회',
    description: {
      title: '스터디 목록을 조회합니다.',
      contents: ['개설된 모든 스터디 목록을 조회합니다.'],
    },
    required: false,
  })
  @Get()
  getStudies(@Query() queryParamsDto?: QueryParamsDto) {
    return this.studiesService.getStudies(queryParamsDto);
  }

  @ApiCustomDocs({
    summary: '스터디 상세 조회',
    description: {
      title: '스터디 상세 정보를 조회합니다.',
      contents: ['특정 스터디의 상세 정보를 조회합니다.'],
    },
  })
  @Get(':id')
  getStudyById(@Param('id') id: string) {
    return this.studiesService.getStudyById(id);
  }

  @ApiCustomDocs({
    summary: '스터디 수정',
    description: {
      title: '스터디 정보를 수정합니다.',
      contents: ['특정 스터디의 정보를 수정합니다.'],
    },
    requestType: UpdateStudyDto,
    responseType: UpdateStudyResponseDto,
  })
  @Patch(':id')
  updateStudy(@Param('id') id: string, @Body() updateStudyDto: UpdateStudyDto) {
    return this.studiesService.updateStudy(id, updateStudyDto);
  }

  @ApiCustomDocs({
    summary: '스터디 삭제',
    description: {
      title: '스터디를 삭제합니다.',
      contents: ['특정 스터디를 삭제합니다.'],
    },
  })
  @Delete(':id')
  deleteStudy(@Param('id') id: string) {
    return this.studiesService.deleteStudy(id);
  }
}
