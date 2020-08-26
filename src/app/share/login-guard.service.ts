import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
	providedIn: 'root'
})
export class LoginGuardService implements CanActivate {
	constructor(private auth: AuthenticationService, private router: Router) {}

	canActivate(route: ActivatedRouteSnapshot): boolean {
		let currentUsr: any;
		this.auth.currentUser.subscribe((x) => (currentUsr = x));
		// const requireLogin = route.data.requireLogin;
		/*
      1: admin
      2: publicador
      3: cliente
    */
		if (!currentUsr) {
			this.router.navigate(['/home'], { queryParams: { login: 'true' } });
			return false;
		}
		return true;
	}
}
