import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['https://freitaseroepke.vercel.app/#/', 'https://freitaseroepke.vercel.app/', 'https://freitaseroepke.vercel.app'],
    credentials: true
  })
  await app.listen(process.env.PORT);
}
bootstrap();
