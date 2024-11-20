import { ApiPropertyOptional, OmitType, PickType } from '@nestjs/swagger';
import { CreateStudyDto } from './create-study.dto';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
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

/**
 * UUID 배열을 받아 최근 방문한 스터디 목록을 조회할 때 사용할 데이터 형식을 정의한 객체
 * - 중복된 UUID를 받지 않도록 @ArrayUnique() 데코레이터를 사용
 * - 최대 3개로 제한하는 이유: 화면에 최대 3개까지만 표시하기로 결정함
 */
export class RecentStudiesRequestDto {
  @ApiPropertyOptional({
    description: '조회할 스터디 UUID(v4) 배열(0~3개)',
    example: [
      'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      '550e8400-e29b-41d4-a716-446655440000',
    ],
    type: [String],
    minItems: 0,
    maxItems: 3,
    uniqueItems: true,
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMinSize(0)
  @ArrayMaxSize(3)
  @ArrayUnique()
  uuids: string[];
}

// 스터디 목록 조회 시 Query String으로 받을 데이터 형식을 정의한 객체
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

// 스터디 검색 시 검색 키워드를 받을 데이터 형식을 정의한 객체
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

// password 필드를 제외한 CreateStudyDto를 상속받아 사용하기 위해 정의
export class OmitPasswordDto extends OmitType(CreateStudyDto, [
  'password',
] as const) {}

// SearchKeywordResponseDto는 스터디 검색 시 클라이언트에게 전달할(응답) 데이터 형식을 정의한 객체
export class SearchKeywordResponseDto extends OmitPasswordDto {}
// RecentStudiesResponseDto는 최근 조회한 스터디 목록 조회 시 클라이언트에게 전달할(응답) 데이터 형식을 정의한 객체
export class RecentStudiesResponseDto extends OmitPasswordDto {}
