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
import {
  QueryParamsDto,
  RecentStudiesResponseDto,
  RecentStudiesRequestDto,
  SearchKeywordDto,
  SearchKeywordResponseDto,
} from './dto/retrieve-study.dto';
import { VerifyStudyPasswordRequestDto } from './dto/verify-study.dto';

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
  createStudy(@Body() createStudyDto: CreateStudyDto) {
    return this.studiesService.createStudy(createStudyDto);
  }

  @ApiCustomDocs({
    summary: '최근 조회한 스터디 목록 요청',
    description: {
      title: '클라이언트에서 최근 조회한 스터디 목록을 요청합니다.',
      contents: [
        'localStorage에 저장되어있는 최근 조회한 스터디 목록(UUIDs)을 서버에 요청하고 해당 스터디 목록을 반환합니다.',
        'UUIDs는 최소 0개에서 최대 3개까지만 전달하며, 중복된 UUID는 전달되지 않습니다.',
        '존재하지 않는 UUID는 무시합니다.',
      ],
    },
    requestType: RecentStudiesRequestDto,
    responseType: RecentStudiesResponseDto,
  })
  // @GET으로 변경 시 axios 요청 시 body를 보낼 수 없기 때문에 RESTful하지 않으나 POST로 구현함
  @Post('recent')
  getRecentStudies(@Body() recentStudiesRequestDto?: RecentStudiesRequestDto) {
    return this.studiesService.getRecentStudies(recentStudiesRequestDto);
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
    summary: '스터디 검색',
    description: {
      title: '스터디를 검색합니다.',
      contents: ['특정 키워드로 스터디를 검색합니다.'],
    },
    required: false,
    requestType: SearchKeywordDto,
    responseType: SearchKeywordResponseDto,
  })
  @Get('search')
  searchStudies(@Query() searchKeywordDto?: SearchKeywordDto) {
    return this.studiesService.searchStudies(searchKeywordDto);
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

  @ApiCustomDocs({
    summary: '스터디 비밀번호 검증',
    description: {
      title: '스터디 비밀번호를 검증합니다.',
      contents: ['특정 스터디의 비밀번호를 검증합니다.'],
    },
    requestType: VerifyStudyPasswordRequestDto,
    responseType: Boolean,
  })
  @Post(':id/verify')
  verifyStudyPassword(
    @Param('id') id: string,
    @Body() verifyStudyPasswordDto: VerifyStudyPasswordRequestDto,
  ) {
    return this.studiesService.verifyStudyPassword(
      id,
      verifyStudyPasswordDto.password,
    );
  }
}
