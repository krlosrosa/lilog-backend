import { NestFactory } from '@nestjs/core';
import { AppModule } from './main/app.module.js';
import { setupSwagger } from './main/docs/swagger.config.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // permite todas as origens (pode substituir pelo domínio específico)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-center'],
  });
  app.setGlobalPrefix('api');
  setupSwagger(app); // 2. Chame a função para configurar o Swagger
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
