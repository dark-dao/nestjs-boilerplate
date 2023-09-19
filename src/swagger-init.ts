import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function swaggerInit(
  app: INestApplication,
  configService: ConfigService,
): void {
  const options = new DocumentBuilder()
    .setTitle('Backend')
    .setDescription('API description')
    .setVersion(configService.get('version'))
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
