import { PartialType } from '@nestjs/swagger';
import { CreateStudyDto, CreateStudyResponseDto } from './create-study.dto';
/**
 * 주의 : PartialType 메서드는 반드시 @nestjs/Swagger에서 import해야 Schema를 제대로 생성합니다!
 */

export class UpdateStudyDto extends PartialType(CreateStudyDto) {}

export class UpdateStudyResponseDto extends PartialType(
  CreateStudyResponseDto,
) {}
