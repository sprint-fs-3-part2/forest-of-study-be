import { Controller, Body, Param, Patch } from '@nestjs/common';
import { PointsService } from './points.service';
import { CreatePointDto } from './dto/create-point.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiCustomDocs } from 'src/shared/swagger/ApiCustomDocs';

@ApiTags('points')
@Controller('points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @ApiCustomDocs({
    summary: '포인트 업데이트',
    description: {
      title: '포인트를 업데이트합니다.',
      contents: ['포인트 점수를 입력받아 포인트를 추가해서 업데이트를 합니다.'],
    },
    requestType: CreatePointDto,
    responseType: CreatePointDto,
  })
  @Patch(':studyId')
  async updatePoint(
    @Param('studyId') studyId: string,
    @Body() createPointDto: CreatePointDto,
  ) {
    const data = { ...createPointDto, studyId };
    return await this.pointsService.updatePoint(data);
  }
}
