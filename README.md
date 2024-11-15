# 공부의숲 백엔드

## Description

[Nest](https://github.com/nestjs/nest) 프레임워크를 사용한 공부의숲 백엔드 입니다.

## Tech Stacks

- NodeJS 20
- NestJS 10.4.7
- Typescript 5.6.3

## 프로젝트 설정

## 권장 VS Code 확장팩

프로젝트 개발에 도움이 되는 VS Code 확장팩들입니다:

### 코드 품질

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - TypeScript/JavaScript 코드 품질과 스타일 검사
- [Pretty TypeScript Errors](https://marketplace.visualstudio.com/items?itemName=yoavbls.pretty-ts-errors)
  - TypeScript 에러 메시지를 더 읽기 쉽게 표시

### 개발 생산성

- [Prisma](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma)
  - Prisma 스키마 파일 지원
- [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
  - 일관된 코딩 스타일 유지
- [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
  - 코드 내 영문 스펠링 체크

### TODO 관리

- [TODO Tree](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree)
  - TODO/FIXME 등 주석 하이라이트 및 트리뷰
- [TODO Highlight](https://marketplace.visualstudio.com/items?itemName=wayou.vscode-todo-highlight)
  - TODO/FIXME 등 주석 하이라이트

### Git

- [Gitmoji](https://marketplace.visualstudio.com/items?itemName=seatonjiang.gitmoji-vscode)
  - 커밋 메시지에 이모지 추가 지원

### 프로젝트 초기화

- npm i -g @nestjs/cli 를 통해 nest cli 설치
- nest new forest-of-study-be 를 통해 프로젝트 생성

### CRUD 생성

- nest g res studies 를 통해 스터디 관련 CRUD 리소스 생성
- nest g res habits 를 통해 오늘의 습관 관련 CRUD 리소스 생성
- nest g res points 를 통해 오늘의 집중 포인트 관련 CRUD 리소스 생성
- nest g res reactions 를 통해 응원 이모지 관련 CRUD 리소스 생성

### 환경변수 설정

- npm i @nestjs/config 를 설치하여 NestJS에서 환경변수 세팅
- npx prisma init --datasource-provider postgresql 를 통해 prisma 스키마 초기환경 구축
- npm i @prisma/client 설치 및 shared/prismaClient.ts 세팅

### Prisma 모델 설정 및 마이그레이션

- prisma/schema.prisma에 모델(스터디, 습관, 완료된 습관, 오늘의 집중, 리액션 모델) 설정
- npx prisma migrate dev --name init을 통해 서버에 마이그레이션

### 백엔드 코드 Push

- 원격 저장소 추가

```bash
$ git remote add origin https://github.com/sprint-fs-3-part2/forest-of-study-be.git
ㅤ
```

- 깃 변경사항 반영 커밋

```bash
$ git add . && git commit -m 'initial commit'
ㅤ
```

- 초기 설정 Remote Repository에 push

```bash
$ git push origin main
ㅤ
```

## 패키지 설치 방법

### 노드 버전 설치

#### Windows 기준

- Windows 11 : Windows 설정(단축키 : Win+i) - 앱 - 앱 및 기능 - 설치된 node 버전 제거
- Windows 10 이하 : Windows 검색(단축키 : Win+s) - 제어판 검색 - 프로그램 제거 - 설치된 node 버전 제거
- nvm(node version manager) 설치하기 : [nvm-setup.exe](https://github.com/coreybutler/nvm-windows/releases/download/1.1.12/nvm-setup.zip) 내려받아 nvm 설치(꽌리자 권한으로 설치)
- git bash에서 nvm 사용가능 여부 확인

```bash
$ nvm -v
0.40.1
```

- nvm으로 노드 버전 설치(.nvmrc에 기재된 버전으로 노드 설치)

```bash
$ nvm install
Found '${workspace}/.nvmrc' with version <20>
Downloading and installing node v20.18.0...
Downloading https://nodejs.org/dist/v20.18.0/node-v20.18.0-linux-x64.tar.xz...
Computing checksum with sha256sum
Checksums matched!
Now using node v20.18.0 (npm v10.8.2)
Creating default alias: default -> 20 (-> v20.18.0)
$ nvm use
Found '${workspace}/.nvmrc' with version <20>
Now using node v20.18.0 (npm v10.8.2)
```

#### macOS 기준

- 터미널에서 brew uninstall node를 통해 기존 node 버전 삭제
- 터미널에서 아래 코드 중 하나를 선택하여 nvm 설치

```bash
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
=> Downloading nvm from git to '~/.nvm'
...
$ wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
=> Downloading nvm from git to '~/.nvm'
...
```

- vi ~/.zshrc 열어서 맨 아래에 아래 스크립트 추가

```zsh
export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
  [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

- nvm 사용가능 여부 확인

```bash
$ command -v nvm
0.40.1
```

- nvm으로 노드 버전 설치(.nvmrc에 기재된 버전으로 노드 설치)

```bash
$ nvm install
Found '${workspace}/.nvmrc' with version <20>
Downloading and installing node v20.18.0...
Downloading https://nodejs.org/dist/v20.18.0/node-v20.18.0-linux-x64.tar.xz...
Computing checksum with sha256sum
Checksums matched!
Now using node v20.18.0 (npm v10.8.2)
Creating default alias: default -> 20 (-> v20.18.0)
$ nvm use
Found '${workspace}/.nvmrc' with version <20>
Now using node v20.18.0 (npm v10.8.2)
```

### 프로젝트에 필요한 패키지 설치

```bash
$ npm install
forest-of-study-be@0.0.1
├── @nestjs/cli@10.4.7
├── @nestjs/common@10.4.7
├── @nestjs/core@10.4.7
...(생략)
```

## 프로젝트 실행 방법

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API 문서 확인 방법

```bash
$ npm run start:dev
# 실행 후 http://localhost:3000/api 접속
```

## 테스팅

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## 배포

## Resources

## Contributors

## License

Forest-of-study is [MIT licensed](https://github.com/sprint-fs-3-part2/forest-of-study-be).
