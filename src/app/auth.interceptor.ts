import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './auth.service';
import { take, exhaustMap } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return authService.user$.pipe(
    take(1),
    exhaustMap(user => {
      if (!user || !user.token) {
        return next(req);
      }

      const authReq = req.clone({
        params: req.params.set('auth', user.token)
      });

      return next(authReq);
    })
  );
};
