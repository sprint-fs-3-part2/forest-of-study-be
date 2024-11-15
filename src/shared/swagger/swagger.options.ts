import {
  DocumentBuilder,
  OpenAPIObject,
  SwaggerCustomOptions,
} from '@nestjs/swagger';

const swaggerCustomOptions = () => {
  const result: SwaggerCustomOptions = {
    customSiteTitle: '공부의 숲 API',
  };
  return result;
};

const swaggerOption = (): Omit<OpenAPIObject, 'paths'> => {
  const options = new DocumentBuilder()
    .setTitle('공부의 숲 API')
    .setDescription('공부의 숲 API 명세서')
    .setVersion('1.0')
    .addTag('studies', '스터디 관리')
    .addTag('habits', '습관 관리')
    .addTag('points', '포인트 관리')
    .addTag('reactions', '응원 관리')
    .build();

  return options;
};

const docsOptions = {
  swagger: swaggerOption,
  swaggerCustom: swaggerCustomOptions,
};

export default docsOptions;
