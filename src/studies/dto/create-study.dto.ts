import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

// POST /studies
// CreateStudyDto는 한 개의 스터디 생성 시 클라이언트로부터 받을(요청) 데이터 형식을 정의한 객체
export class CreateStudyDto {
  @ApiProperty({
    nullable: false,
    description: '스터디 이름',
    example: 'UX 스터디',
    type: String,
  })
  name: string;
  @ApiProperty({
    nullable: false,
    description: '스터디 개설자의 닉네임',
    example: 'K.K.',
    type: String,
  })
  nickname: string;
  @ApiProperty({
    nullable: false,
    description: '스터디 소개',
    example: '나비보벳따우',
    type: String,
  })
  intro: string;
  @ApiProperty({
    nullable: false,
    description: '스터디 배경 이미지',
    example: 'green',
    type: String,
  })
  background: string;
  @ApiProperty({
    nullable: false,
    description: '스터디 비밀번호',
    example: '1q2w3e4r',
    type: String,
  })
  @Exclude({ toPlainOnly: true })
  password: string;
}

// CreateStudyResponseDto는 한 개의 스터디 생성 시 클라이언트에 전달할(응답) 데이터 형식을 정의한 객체
// 스터디 생성이 완료되면 클라이언트에게 해당 스터디의 ID를 전달
// 이후 클라이언트는 해당 스터디 ID를 이용하여 스터디 상세 페이지에 필요한 정보를 요청함
// 유저 플로우 : 스터디 만들기 Page -> 스터디 상세 Page
export class CreateStudyResponseDto {
  @ApiProperty({
    description: '스터디 ID (UUIDv4)',
    example: crypto.randomUUID(),
    type: String,
  })
  id: string;
  // static of 메서드는 CreateStudyResponseDto 객체(Study ID)를 생성하여 반환함
  static of(id: string): CreateStudyResponseDto {
    return { id };
  }
}
