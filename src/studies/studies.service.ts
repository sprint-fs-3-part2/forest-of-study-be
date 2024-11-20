import { Injectable, Query } from '@nestjs/common';
import { CreateStudyDto, CreateStudyResponseDto } from './dto/create-study.dto';
import { UpdateStudyDto } from './dto/update-study.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  QueryParamsDto,
  SearchKeywordDto,
  RecentStudiesRequestDto,
} from './dto/retrieve-study.dto';

@Injectable()
export class StudiesService {
  // PrismaService를 주입
  constructor(private readonly prisma: PrismaService) {}

  // 민감한 필드를 상수로 선언하기
  private readonly SENSITIVE_FIELDS = {
    password: true,
    createdAt: true,
    updatedAt: true,
  } as const;

  async getRecentStudies(recentStudiesRequestDto?: RecentStudiesRequestDto) {
    try {
      // 가져온 UUIDs DTO 유효성 검사
      const { uuids = [] } = recentStudiesRequestDto;
      if (uuids.length > 3) {
        throw new Error('최대 3개의 스터디 UUID를 전달할 수 있습니다');
      }
      // 최근 조회한 Study ID 배열을 이용하여 최근 조회한 스터디 목록을 가져옴
      const studies = await this.prisma.study.findMany({
        omit: this.SENSITIVE_FIELDS,
        where: {
          id: {
            in: uuids,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      if (studies.length === 0) {
        return { studies: [], message: '아직 조회한 스터디가 없어요' };
      }
      return studies;
    } catch (error) {
      return { error: error.message };
    }
  }

  async createStudy(createStudyDto: CreateStudyDto) {
    // 스터디 생성 시, 스터디 정보를 생성하고, 생성한 스터디의 ID를 반환
    const study = await this.prisma.study.create({
      data: createStudyDto,
    });
    return CreateStudyResponseDto.of(study.id);
  }

  async getStudies(@Query() queryParamsDto: QueryParamsDto) {
    // 모든 스터디 목록을 조회
    // 조회 시 Query String을 활용하여 오프셋 기반 페이지네이션을 구현해야 함
    // page, take, orderBy, order를 Query String으로 받아와서 사용
    const {
      page = 1,
      take = 6,
      orderBy = 'createdAt',
      order = 'desc',
    } = queryParamsDto;
    return this.prisma.study.findMany({
      omit: this.SENSITIVE_FIELDS,
      skip: Number((page - 1) * take) || 0,
      take: Number(take) || 6,
      orderBy: { [orderBy || 'createdAt']: order || 'desc' },
    });
  }

  async searchStudies(@Query() searchKeywordDto: SearchKeywordDto) {
    try {
      // 스터디 목록 조회 시, 검색어를 이용하여 스터디 목록을 조회
      // 검색 대상은 name, nickname, intro 필드
      const {
        keyword,
        page = 1,
        take = 6,
        orderBy = 'createdAt',
        order = 'desc',
      } = searchKeywordDto;
      const studies = await this.prisma.study.findMany({
        omit: this.SENSITIVE_FIELDS,
        skip: Number((page - 1) * take) || 0,
        take: Number(take) || 6,
        orderBy: { [orderBy || 'createdAt']: order || 'desc' },
        where: {
          OR: [
            {
              name: {
                contains: keyword,
                mode: 'insensitive',
              },
            },
            {
              nickname: {
                contains: keyword,
                mode: 'insensitive',
              },
            },
            {
              intro: {
                contains: keyword,
                mode: 'insensitive',
              },
            },
          ],
        },
      });
      if (studies.length === 0) {
        return { studies: [], message: '아직 둘러 볼 스터디가 없어요' };
      }
      return studies;
    } catch (error) {
      return { error: error.message };
    }
  }

  async getStudyById(id: string) {
    // return `This action returns a #${id} study`;
    return this.prisma.study.findUnique({
      omit: this.SENSITIVE_FIELDS,
      where: {
        id,
      },
    });
  }

  async updateStudy(id: string, updateStudyDto: UpdateStudyDto) {
    return this.prisma.study.update({
      where: {
        id,
      },
      data: updateStudyDto,
    });
  }

  async deleteStudy(id: string) {
    return this.prisma.study.delete({
      where: {
        id,
      },
    });
  }
}
