import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TerminusModule } from '@nestjs/terminus';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageMongoService } from 'nestjs-throttler-storage-mongo';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DigitalFingerprintMiddleware } from './middlewares/digitalFingerprintMiddleware';
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import configuration from './config';

@Module({
  imports: [
    TerminusModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRoot(configuration().db.connectionString, {
      retryAttempts: 10,
      retryDelay: 30,
    }),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      serveRoot: '/',
      rootPath: join(__dirname, '..', 'static'),
      serveStaticOptions: {
        etag: false,
        setHeaders: (res, path) => {
          res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
          res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
          res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
        },
      },
    }),
    ThrottlerModule.forRoot({
      storage: new ThrottlerStorageMongoService(
        configuration().db.connectionString,
      ),
      throttlers: [
        {
          name: 'main',
          ttl: configuration().throttle.ttl,
          limit: configuration().throttle.limit,
        },
      ],
    }),
    HealthcheckModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DigitalFingerprintMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
