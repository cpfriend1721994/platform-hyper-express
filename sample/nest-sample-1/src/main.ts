import { NestFactory } from '@nestjs/core';
import { HyperExpressAdapter } from '@nnmt/platform-hyper-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new HyperExpressAdapter());
  await app.listen(3000);
}
bootstrap();
