import { ApiPropertyOptional, OmitType, PickType } from '@nestjs/swagger';
import { CreateStudyDto } from './create-study.dto';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

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
  @IsInt()
  @Min(1)
  @IsNumber()
  @IsOptional()
  page?: number;
  @ApiPropertyOptional({
    description:
      '스터디 목록 조회 시 Offset 기반 페이지네이션 스킵할 데이터 수 (skip=0)',
    example: 0,
    type: Number,
  })
  @IsInt()
  @Min(0)
  @IsNumber()
  @IsOptional()
  skip?: number;
  @ApiPropertyOptional({
    description:
      '스터디 목록 조회 시 Offset 기반 페이지네이션 가져올 데이터 수 (take=6), 한 번에 최대 60개',
    example: 6,
    type: Number,
  })
  @IsInt()
  @Min(1)
  @Max(60)
  @IsNumber()
  @IsOptional()
  take?: number;
  @ApiPropertyOptional({
    description: '스터디 목록 조회 시 정렬 기준 (orderBy=createdAt)',
    example: 'createdAt',
    type: String,
    enum: OrderBy,
  })
  @IsEnum(OrderBy)
  @IsOptional()
  orderBy?: OrderBy;

  @ApiPropertyOptional({
    description: '스터디 목록 조회 시 정렬 방식 (order=desc)',
    example: 'desc',
    type: String,
    enum: SortOrder,
  })
  @IsEnum(SortOrder)
  @IsOptional()
  order?: SortOrder;
}

export class SearchKeywordDto extends PickType(QueryParamsDto, [
  'page',
  'skip',
  'take',
  'orderBy',
  'order',
]) {
  @ApiPropertyOptional({
    description: '스터디 검색 키워드 (최대 50자, 한글/영문/숫자/공백만 허용)',
    example: '개발',
    type: String,
    minLength: 1,
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(50)
  @Matches(/^[가-힣a-zA-Z0-9\s]*$/, {
    message: '특수문자는 사용할 수 없습니다',
  })
  keyword?: string;
}

// SearchKeywordResponseDto는 스터디 검색 시 클라이언트에게 전달할(응답) 데이터 형식을 정의한 객체
// password 필드를 제외한 CreateStudyDto를 상속받아 사용
export class SearchKeywordResponseDto extends OmitType(CreateStudyDto, [
  'password',
] as const) {}
