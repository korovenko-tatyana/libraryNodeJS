import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 8000;

  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix(process.env.API_PREFIX);
  
  const config = new DocumentBuilder()
    .setTitle('Library')
    .setDescription('Documentation api methods')
    .setVersion('1.0.0')
    //.addTag('api')
    .addBearerAuth()
    .build();

  //const options = new DocumentBuilder().addBearerAuth();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/doc', app, document);
  
  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

bootstrap();
