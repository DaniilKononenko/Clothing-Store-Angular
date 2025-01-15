import { HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { catchError, switchMap, throwError } from "rxjs";
import { Router } from "@angular/router";
import { TokenResponce } from "../models/token-responce";

export const authInteptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const router: Router = inject(Router)
  const authService: AuthService = inject(AuthService)
  const token: string | null = authService.getAccessToken()

  // Проверка наличия токена
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 403) {
        return authService.refreshToken().pipe(
          switchMap((token: TokenResponce) => {
              const newAuthReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${token.access_token}`,
                },
              });
              return next(newAuthReq);
            }),
          catchError(() => {
            router.navigate(['/login']);
            return throwError(() => new Error('Refresh token expired'));
          })
        );
      }

      return throwError(() => error);
    })
  );
}