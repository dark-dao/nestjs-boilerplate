import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { HealthCheckController } from './healthcheck.controller';
import { HealthcheckService } from './healthcheck.service';

@Module({
  imports: [TerminusModule, HttpModule, ThrottlerModule],
  controllers: [HealthCheckController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    HealthcheckService,
  ],
})
export class HealthcheckModule {}
