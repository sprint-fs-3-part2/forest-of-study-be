import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('공부의 숲 API')
    .setDescription('공부의 숲 API 명세서')
    .setVersion('1.0')
    .addTag('studies', '스터디 관리')
    .addTag('habits', '습관 관리')
    .addTag('points', '포인트 관리')
    .addTag('reactions', '응원 관리')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
