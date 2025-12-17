import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import config from 'config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS 설정
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  
  const port = config.get<number>('server.port');
  await app.listen(port);
  Logger.log(`Server is running on port ${port}`);
}
bootstrap();
