import { Injectable, Query } from '@nestjs/common';
import { CreateStudyDto, CreateStudyResponseDto } from './dto/create-study.dto';
import { UpdateStudyDto } from './dto/update-study.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryParamsDto } from './dto/retreive-study.dto';

@Injectable()
export class StudiesService {
  remove(id: string) {
    throw new Error('Method not implemented.');
  }
  // 최근 조회한 스터디 UUID 배열을 저장(private로 선언하여 외부에서 접근 불가능하도록 함)
  private recentStudies: string[] = [];
  // PrismaService를 주입
  constructor(private readonly prisma: PrismaService) {}

  async OnModuleInit() {
    // 클라이언트 로컬 스토리지에서 최근 조회한 StudyId 배열을 가져옴, 없으면 빈 배열을 할당
    this.recentStudies =
      JSON.parse(localStorage.getItem('recentStudies')) || [];
  }

  async getRecentStudies() {
    // 최근 조회한 Study ID 배열을 이용하여 최근 조회한 스터디 목록을 가져옴
    const studies = await this.prisma.study.findMany({
      where: {
        id: {
          in: this.recentStudies,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const newRecentStudies = studies.map((study) => study.id);
    localStorage.setItem('recentStudies', JSON.stringify(newRecentStudies));
    return studies;
  }

  async createStudy(createStudyDto: CreateStudyDto) {
    // 스터디 생성 시, 스터디 정보를 생성하고, 생성한 스터디의 ID를 반환
    const study = await this.prisma.study.create({
      data: createStudyDto,
    });
    return CreateStudyResponseDto.of(study.id);
    // return study.id;
  }

  // @Query('page'): number = 1, @Query('take'): number = 6
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
      skip: Number((page - 1) * take) || 0,
      take: Number(take) || 6,
      orderBy: { [orderBy || 'createdAt']: order || 'desc' },
    });
  }

  async getStudyById(id: string) {
    // return `This action returns a #${id} study`;
    return this.prisma.study.findUnique({
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
