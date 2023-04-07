import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'; // Add this import

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser()); // Add this line
  await app.listen(3000);
}
bootstrap();