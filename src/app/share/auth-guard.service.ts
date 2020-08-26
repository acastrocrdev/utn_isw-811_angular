import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/share/authentication.service';

@Injectable({
	providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
	constructor(private auth: AuthenticationService, private router: Router) {}

	canActivate(): boolean {
		if (!this.auth.currentUserValue) {
			this.router.navigate(['/home'], { queryParams: { auth: 'true' } });
			return false;
		}
		return true;
	}
}
