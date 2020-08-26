import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
	providedIn: 'root'
})
export class RoleGuardService implements CanActivate {
	constructor(private auth: AuthenticationService, private router: Router) {}

	canActivate(route: ActivatedRouteSnapshot): boolean {
		let currentUsr: any;
		this.auth.currentUser.subscribe((x) => (currentUsr = x));
		const requireRole = route.data.requireRole;
		/*
      1: admin
      2: publicador
      3: cliente
    */
		if (!currentUsr || currentUsr.user.rol_id > requireRole) {
			this.router.navigate(['/home'], { queryParams: { role: 'true' } });
			return false;
		}
		return true;
	}
}
