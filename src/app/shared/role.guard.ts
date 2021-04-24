import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take, tap, map } from 'rxjs/operators';
import { AuthService } from '../core/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate, CanLoad {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authorizeRoute(next);
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this.authorizeRoute(route);
  }
  private authorizeRoute(route: Route | ActivatedRouteSnapshot) {
    return this.auth.user$.pipe(
      take(1),
      map(user => user && this.auth.checkAuthorization(user, route.data.allowedRoles as string[])),
      tap(loggedIn => {
        if (!loggedIn) {
          console.log('Access denied. Not logged in or insufficient permission.')
        }
      })
    )
  }
}
