import { NestFactory } from '@nestjs/core';
import {
  HyperExpressAdapter,
  NestHyperExpressApplication,
} from '@nnmt/platform-hyper-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestHyperExpressApplication>(
    AppModule,
    new HyperExpressAdapter(),
  );
  await app.listen(3000);
}
bootstrap();
