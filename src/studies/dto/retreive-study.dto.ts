import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { CreateStudyDto } from './create-study.dto';
import { Exclude } from 'class-transformer';

export enum OrderBy {
  createdAt = 'createdAt',
  points = 'points',
}

export enum SortOrder {
  desc = 'desc',
  asc = 'asc',
}

export class QueryParamsDto {
  @ApiPropertyOptional({
    description:
      '스터디 목록 조회 시 Offset 기반 페이지네이션 현재 page 값 (page=1)',
    example: 1,
    type: Number,
  })
  page?: number;
  @ApiPropertyOptional({
    description:
      '스터디 목록 조회 시 Offset 기반 페이지네이션 스킵할 데이터 수 (skip=0)',
    example: 0,
    type: Number,
  })
  skip?: number;
  @ApiPropertyOptional({
    description:
      '스터디 목록 조회 시 Offset 기반 페이지네이션 가져올 데이터 수 (take=6)',
    example: 6,
    type: Number,
  })
  take?: number;
  @ApiPropertyOptional({
    description: '스터디 목록 조회 시 정렬 기준 (orderBy=createdAt)',
    example: 'createdAt',
    type: String,
    enum: OrderBy,
  })
  orderBy?: OrderBy;

  @ApiPropertyOptional({
    description: '스터디 목록 조회 시 정렬 방식 (order=desc)',
    example: 'desc',
    type: String,
    enum: SortOrder,
  })
  order?: SortOrder;
}

export class SearchKeywordDto {
  @ApiPropertyOptional({
    description: '검색할 키워드',
    example: '개발',
    type: String,
  })
  keyword?: string;
}

// SearchKeywordResponseDto는 스터디 검색 시 클라이언트에게 전달할(응답) 데이터 형식을 정의한 객체
// password 필드를 제외한 CreateStudyDto를 상속받아 사용
export class SearchKeywordResponseDto extends OmitType(CreateStudyDto, [
  'password',
] as const) {}
