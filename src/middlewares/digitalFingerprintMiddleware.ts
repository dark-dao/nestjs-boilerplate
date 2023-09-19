import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class DigitalFingerprintMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const fingerprint = {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      acceptLanguage: req.headers['accept-language'],
      connection: req.headers['connection'],
      encoding: req.headers['accept-encoding'],
      timezoneOffset: new Date().getTimezoneOffset(),
      // Добавьте другие заголовки или параметры, которые вы считаете нужными
    };

    req['fingerprint'] = fingerprint;

    next();
  }
}
