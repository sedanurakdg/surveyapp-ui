import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { inject } from "@angular/core";

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const roles: string[] = route.data['roles'] ?? [];

  if (!roles.length) return true;

  return auth.hasAnyRole(roles)
    ? true
    : router.parseUrl('/forbidden');
};
