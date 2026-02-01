import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable, isObservable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const result = super.canActivate(context);

    if (isObservable(result)) {
      return result.pipe(
        map((value) => value),
        catchError(() => of(true)),
      );
    }

    return (result as Promise<boolean>).catch(() => true);
  }

  handleRequest<TUser>(err: Error | null, user: TUser): TUser | undefined {
    if (err || !user) {
      return undefined;
    }

    return user;
  }
}
