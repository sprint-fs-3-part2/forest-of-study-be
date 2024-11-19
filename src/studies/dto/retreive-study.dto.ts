import { ApiPropertyOptional } from '@nestjs/swagger';

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
