import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { HeaderInterceptor } from './interceptors/header-interceptor';
import { AppModule } from './app.module';
import { swaggerInit } from './swagger-init';
import { SeederModule } from './mongo-db/seeders/seeder.module';
import { Seeder } from './mongo-db/seeders/seeder';

async function bootstrap() {
  if (process.env.NODE_ENV === 'seeding') {
    NestFactory.createApplicationContext(SeederModule)
      .then((appContext) => {
        const seeder = appContext.get(Seeder);
        seeder
          .seed()
          .then(() => {
            console.log('База заполнена!');
          })
          .catch((error) => {
            console.error('Ошибка при заполнении базы');
            throw error;
          })
          .finally(() => {
            appContext.close();
            // process.exit(0);
          });
      })
      .catch((error) => {
        throw error;
      });
    return;
  }
  if (process.env.NODE_ENV === 'dropdb') {
    NestFactory.createApplicationContext(SeederModule)
      .then((appContext) => {
        const seeder = appContext.get(Seeder);
        seeder
          .dropCollections()
          .then(() => {
            console.log('База очищена!');
          })
          .catch((error) => {
            console.error('Ошибка при очистке базы');
            throw error;
          })
          .finally(() => {
            appContext.close();
            // process.exit(0);
          });
      })
      .catch((error) => {
        throw error;
      });
    return;
  }
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);

  app.setGlobalPrefix('api');
  app.enableCors({
    allowedHeaders: ['*', 'Content-Type', 'Authorization'],
    credentials: true,
    origin: [
      ...configService
        .get('allowedDomains')
        .split(';')
        .map((domain: string) => new RegExp(`${domain}`)),
    ],
  });
  app.useGlobalInterceptors(new HeaderInterceptor());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(helmet());
  app.use(cookieParser());
  if (process.env.NODE_ENV !== 'production') {
    swaggerInit(app, configService);
  }

  app.enableShutdownHooks();

  console.log('ENV: ', process.env.NODE_ENV);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
