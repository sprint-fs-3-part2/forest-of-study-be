import { BadRequestException, Injectable, Query } from '@nestjs/common';
import { CreateStudyDto, CreateStudyResponseDto } from './dto/create-study.dto';
import { UpdateStudyDto } from './dto/update-study.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  QueryParamsDto,
  SearchKeywordDto,
  RecentStudiesRequestDto,
} from './dto/retrieve-study.dto';
import * as argon2 from 'argon2';

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
    // 가져온 UUIDs DTO 유효성 검사
    const { uuids = [] } = recentStudiesRequestDto || {};
    if (uuids.length > 3) {
      throw new BadRequestException(
        '최대 3개의 스터디 UUID를 전달할 수 있습니다',
      );
    }
    // 최근 조회한 Study ID 배열을 이용하여 최근 조회한 스터디 목록을 가져옴
    const studies = await this.prisma.study.findMany({
      // omit: this.SENSITIVE_FIELDS,
      where: {
        id: {
          in: uuids,
        },
      },
      include: {
        focus: {
          select: {
            points: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return studies.map(({ focus, ...study }) => ({
      ...study,
      points: focus?.points ?? 0,
    }));
  }

  async createStudy(createStudyDto: CreateStudyDto) {
    // 비밀번호 해싱(Salt는 argon2 기본값 사용)
    let hashedPassword;
    try {
      hashedPassword = await argon2.hash(createStudyDto.password);
    } catch (error) {
      console.log(error);
      throw new BadRequestException('비밀번호 해싱 중 오류가 발생했습니다');
    }
    // 스터디 생성
    const study = await this.prisma.study.create({
      data: {
        ...createStudyDto,
        password: hashedPassword, // 해싱된 비밀번호 저장
        focus: {
          create: {
            points: 0,
          },
        },
      },
    });
    return CreateStudyResponseDto.of(study.id);
  }

  // 비밀번호 검증이 필요한 경우 사용할 메서드 추가
  async verifyStudyPassword(
    studyId: string,
    plainPassword: string,
  ): Promise<boolean> {
    const study = await this.prisma.study.findUnique({
      where: { id: studyId },
      select: { password: true },
    });

    if (!study) return false;
    return await argon2.verify(study.password, plainPassword);
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

    const studies = await this.prisma.study.findMany({
      select: {
        id: true,
        name: true,
        nickname: true,
        intro: true,
        background: true,
        createdAt: true, // 0일째 진행중 표기를 위해 createdAt 필드 추가
        focus: {
          select: {
            points: true,
          },
        },
      },
      skip: Number((page - 1) * take) || 0,
      take: Number(take) || 6,
      orderBy: { [orderBy || 'createdAt']: order || 'desc' },
    });

    return studies.map(({ focus, ...study }) => ({
      ...study,
      points: focus?.points ?? 0,
    }));
  }

  async searchStudies(@Query() searchKeywordDto: SearchKeywordDto) {
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
      // omit: this.SENSITIVE_FIELDS,
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
    return studies;
  }

  async getStudyById(id: string) {
    // return `This action returns a #${id} study`;

    const study = await this.prisma.study.findUnique({
      // omit: this.SENSITIVE_FIELDS,
      where: {
        id,
      },
      include: {
        focus: {
          select: {
            points: true,
          },
        },
      },
    });

    const { focus, ...studyWithoutFocus } = study;

    return {
      ...studyWithoutFocus,
      points: focus?.points ?? 0,
    };
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
