import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    const allowedRoles = route.data['roles'] as Array<string>;
    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        if (user && allowedRoles && allowedRoles.includes(user.role)) {
          return true;
        } else {
          return this.router.createUrlTree(['/403']);
        }
      })
    );
  }
}
