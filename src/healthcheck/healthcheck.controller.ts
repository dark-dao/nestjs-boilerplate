import { Controller, Get, Param, Res, Req } from '@nestjs/common';
import { Response } from 'express';
import {
  HealthCheck,
  HttpHealthIndicator,
  HealthCheckService,
  MongooseHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { Throttle } from '@nestjs/throttler';

import { HealthcheckService as healthcheckService } from './healthcheck.service';
import { ELoadTypes } from './healthcheck.types';

@Controller('health')
@Throttle({ main: { limit: 100, ttl: 60000 } })
export class HealthCheckController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private mongoose: MongooseHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private healthcheckService: healthcheckService,
  ) {}

  @Get()
  @HealthCheck()
  async check(@Req() req: any) {
    console.log('Call healthcheck 🤖');
    return await this.health.check([
      async () => this.mongoose.pingCheck('mongoose'),
      async () =>
        await this.http.pingCheck(
          'core.telegram.org',
          'https://core.telegram.org',
          {
            timeout: 800,
            timeoutErrorMessage:
              'Ping to https://core.telegram.org is failed ):',
          },
        ),
      async () =>
        this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.5 }),
      async () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      async () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
    ]);
  }

  @Get('load-check/:type')
  async loadCheck(@Param('type') type: ELoadTypes, @Res() response: Response) {
    response.set({
      'Content-Type': 'image/jpg',
    });
    return (await this.healthcheckService.loadCheck(type)).pipe(response);
  }
}
