import { NestFactory } from '@nestjs/core';
import { AppModule } from './main/app.module';
import { setupSwagger } from './main/docs/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app); // 2. Chame a função para configurar o Swagger
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
