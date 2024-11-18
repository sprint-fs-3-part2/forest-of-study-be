import { ApiProperty } from '@nestjs/swagger';

export enum SortOrder {
  desc = 'desc',
  asc = 'asc',
}

export class QueryParamsDto {
  @ApiProperty({
    description: '스터디 목록 조회 시 Offset 기반 페이지네이션 현재 page 값',
    example: 'page=1',
    type: String,
  })
  page?: number;
  @ApiProperty({
    description:
      '스터디 목록 조회 시 Offset 기반 페이지네이션 스킵할 데이터 수',
    example: 'skip=0',
    type: String,
  })
  skip?: number;
  @ApiProperty({
    description:
      '스터디 목록 조회 시 Offset 기반 페이지네이션 가져올 데이터 수',
    example: 'take=6',
    type: String,
  })
  take?: number;
  @ApiProperty({
    description: '스터디 목록 조회 시 정렬 기준',
    example: 'orderBy=createdAt',
    type: String,
  })
  orderBy?: string;

  @ApiProperty({
    description: '스터디 목록 조회 시 정렬 방식',
    example: 'order=desc',
    type: 'string',
    enum: SortOrder,
  })
  // @IsEnum(SortOrder)
  order?: SortOrder;
}
