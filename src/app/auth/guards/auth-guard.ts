import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

export const authGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const invert = next.data['invert'] || false;

  authService.checkLS();

  return authService.isLoggedIn$.pipe(
    switchMap((isLogged) => {
      if (!isLogged && !invert) {
        router.navigate(['auth/signin']);

        return of(false);
      } else if (isLogged && invert) {
        router.navigate(['/']);

        return of(false);
      }

      return of(true);
    }),
  );
};
