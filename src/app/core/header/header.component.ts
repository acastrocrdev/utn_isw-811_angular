import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { SharedService } from 'src/app/shared.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from './../../share/authentication.service';
import { GenericService } from 'src/app/share/generic.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NotificacionService } from 'src/app/share/notificacion.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
	currentUser: any;
	serverResponseLocations: any;
	destroy$: Subject<boolean> = new Subject<boolean>();

	constructor(
		private sharedServiceLogin: SharedService,
		private router: Router,
		private route: ActivatedRoute,
		private auth: AuthenticationService,
		private apiConn: GenericService,
		private noti: NotificacionService
	) {
		this.auth.currentUser.subscribe((user) => {
			this.currentUser = user;
		});
	}

	ngOnInit(): void {
		this.getLocations();
	}

	ngOnDestroy(): void {
		// this.destroy$.next(true);
		// this.destroy$.unsubscribe();
	}

	logout(): void {
		this.auth.logout();
		this.router.navigate(['/']);
	}

	showLogin(): void {
		this.sharedServiceLogin.runSubscriptionModalLogin();
		// login_modal
	}

	showRegister(): void {
		this.sharedServiceLogin.runSubscriptionModalRegister();
		// login_modal
	}

	getLocations(): void {
		this.apiConn
			.list('locations')
			.pipe(takeUntil(this.destroy$))
			.subscribe(
				(data: any) => {
					this.serverResponseLocations = data;
				},
				(error: any) => {
					this.noti.msjValidacion(error);
				}
			);
	}

	exitSystem(): void {
		// login_modal
	}
}
