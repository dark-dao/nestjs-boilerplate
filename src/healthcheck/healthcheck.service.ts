import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { promises as fs, createReadStream } from 'fs';
import { join } from 'path';

import { ELoadTypes, ELoadFilenames } from './healthcheck.types';
@Injectable()
export class HealthcheckService {
  private readonly logger = new Logger(HealthcheckService.name);

  async loadCheck(type: ELoadTypes) {
    try {
      const filePath = `${join(
        process.cwd(),
        'src',
        'healthcheck',
        'images',
      )}/${ELoadFilenames[type]}`;
      await fs.access(filePath);
      return createReadStream(filePath);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        `HealthcheckService -> loadPing: error`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
