import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { SharedService } from './../../shared.service';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { NotificacionService } from 'src/app/share/notificacion.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	@ViewChild('login_modal', { read: TemplateRef }) tpl: TemplateRef<any>;
	modalLogin$: Subscription;
	serverResponse: any;
	error: any;
	closeResult: string;
	form: FormGroup;

	constructor(
		private sharedService: SharedService,
		private modalService: NgbModal,
		private authenticationService: AuthenticationService,
		private noti: NotificacionService,
		public fb: FormBuilder,
		private route: ActivatedRoute,
		private router: Router
	) {
		this.modalLogin$ = this.sharedService.suscribeModalLogin().subscribe((obj: any) => {
			this.showLogin();
		});
		if (authenticationService.currentUserValue) {
			this.router.navigate(['/']);
		}
		this.reactiveForm();
	}

	reactiveForm(): void {
		this.form = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required]]
		});
	}

	ngOnInit(): void {}

	showLogin() {
		this.modalService.open(this.tpl, { windowClass: 'modal-login', size: 'sm', centered: true });
	}

	makeLogin(): void {
		if (this.form.invalid) {
			return;
		}
		this.authenticationService.loginUser(this.form.value, null).subscribe(
			(data: any) => {
				this.serverResponse = data;
				if (this.authenticationService.tmpPass == null) {
					this.router.navigate(['home']);
				} else if (this.authenticationService.tmpPass.action == 'next_page') {
					this.router.navigate([this.authenticationService.tmpPass.page]);
					this.authenticationService.tmpPass = null;
				}
				this.modalService.dismissAll();
			},
			(error: any) => {
				this.noti.mensaje('Se ha presentado un error al ingresar', error.error.error, 'error');
			}
		);
	}

	onReset(): void {
		this.form.reset();
	}

	public errorHandling = (control: string, error: string) => {
		return this.form.controls[control].hasError(error) && this.form.controls[control].touched && this.form.controls[control].invalid;
	};

	showRegister(): void {
		this.onReset();
		this.modalService.dismissAll();
		setTimeout(() => {
			this.sharedService.runSubscriptionModalRegister();
		}, 200);
	}

	// Sign in with Facebook
	async FacebookAuth() {
		const fb = await this.authenticationService.FacebookAuth();
		let mail: string;
		if (typeof fb.email != undefined) {
			mail = fb.email;
		} else {
			mail = fb.user.email;
		}
		this.authenticationService.loginUser(null, { app: 'facebook', token: fb.credential.accessToken, email: mail }).subscribe(
			(data: any) => {
				this.serverResponse = data;
				if (this.authenticationService.tmpPass == null) {
					this.router.navigate(['home']);
				} else if (this.authenticationService.tmpPass.action == 'next_page') {
					this.router.navigate([this.authenticationService.tmpPass.page]);
					this.authenticationService.tmpPass = null;
				}
				this.modalService.dismissAll();
			},
			(error: any) => {
				if (error.status == 428) {
					this.noti.mensaje('Usuario no encontrado', 'Debe registrarse para continuar', 'info');
					this.showRegister();
				} else {
					this.noti.mensaje('Se ha presentado un error al ingresar', error.error.error, 'error');
				}
			}
		);
	}

	// Sign in with Google
	async GoogleAuth() {
		const go = await this.authenticationService.GoogleAuth();
		this.authenticationService.loginUser(null, { app: 'google', token: go.credential.accessToken }).subscribe(
			(data: any) => {
				this.serverResponse = data;
				if (this.authenticationService.tmpPass == null) {
					this.router.navigate(['home']);
				} else if (this.authenticationService.tmpPass.action == 'next_page') {
					this.router.navigate([this.authenticationService.tmpPass.page]);
					this.authenticationService.tmpPass = null;
				}
				this.modalService.dismissAll();
			},
			(error: any) => {
				if (error.status == 428) {
					this.noti.mensaje('Usuario no encontrado', 'Debe registrarse para continuar', 'info');
					this.showRegister();
				} else {
					this.noti.mensaje('Se ha presentado un error al ingresar', error.error.error, 'error');
				}
			}
		);
	}
}
