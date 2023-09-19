import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class HeaderInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(() => {
        const res: Response = context.switchToHttp().getResponse();
        res.header('Cross-Origin-Embedder-Policy', 'credentialless');
        res.header('Cross-Origin-Resource-Policy', 'cross-origin');
        res.header('Cross-Origin-Opener-Policy', 'same-origin');
      }),
    );
  }
}
