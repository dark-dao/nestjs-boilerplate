import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import configuration from 'src/config';

@Injectable()
export class Seeder {
  private readonly logger = new Logger(Seeder.name);

  /**
   *
   * @returns Метод для очистки базы
   */
  async dropCollections(): Promise<boolean> {
    if (process.env.NODE_ENV !== 'dropdb') {
      throw 'БАЗА НЕ УДАЛЯЕТСЯ ПРИ ТАКОМ МОДЕ';
      return false;
    }

    try {
      /**
       * Тут удаляются коллекции
       */
      return true;
    } catch (error) {
      this.logger.error(error);
      throw error;
      return false;
    }
  }

  /**
   * наполнение базы
   */
  async seed(): Promise<void> {
    return;
  }
}
