import { PickType } from '@nestjs/swagger';
import { CreateStudyDto } from './create-study.dto';

export class VerifyStudyPasswordRequestDto extends PickType(CreateStudyDto, [
  'password',
]) {}
