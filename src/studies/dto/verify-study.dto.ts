import { PickType } from '@nestjs/swagger';
import { CreateStudyDto } from './create-study.dto';
import { IsNotEmpty } from 'class-validator';

export class VerifyStudyPasswordRequestDto extends PickType(CreateStudyDto, [
  'password',
]) {
  @IsNotEmpty()
  password: string;
}
