import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { SharedService } from './../../shared.service';
import { Subscription, Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { NotificacionService } from 'src/app/share/notificacion.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'app-registro',
	templateUrl: './registro.component.html',
	styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
	@ViewChild('register_modal', { read: TemplateRef }) tpl: TemplateRef<any>;
	modalRegister$: Subscription;
	error: any;
	closeResult: string;
	form: FormGroup;
	roles: any;
	destroy$: Subject<boolean> = new Subject<boolean>();
	submitted: boolean;

	constructor(
		private sharedService: SharedService,
		private modalService: NgbModal,
		private authenticationService: AuthenticationService,
		private generic: GenericService,
		private noti: NotificacionService,
		public fb: FormBuilder,
		private route: ActivatedRoute,
		private router: Router
	) {
		this.submitted = false;
		this.modalRegister$ = this.sharedService.suscribeModalRegister().subscribe((obj: any) => {
			this.showRegister();
		});
		if (authenticationService.currentUserValue) {
			this.router.navigate(['/']);
		}
		this.reactiveForm();
	}

	reactiveForm(): void {
		this.form = this.fb.group(
			{
				name: ['', [Validators.required]],
				email: ['', [Validators.required]],
				password: ['', [Validators.required]],
				confirm_password: ['', [Validators.required]],
				rol_id: ['', [Validators.required]]
			},
			{
				validator: this.ConfirmedValidator('password', 'confirm_password')
			}
		);
		this.getRoles();
	}

	ConfirmedValidator(controlName: string, matchingControlName: string) {
		return (formGroup: FormGroup) => {
			const control = formGroup.controls[controlName];
			const matchingControl = formGroup.controls[matchingControlName];
			if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
				return;
			}
			if (control.value !== matchingControl.value) {
				matchingControl.setErrors({ confirmedValidator: true });
			} else {
				matchingControl.setErrors(null);
			}
		};
	}

	ngOnInit(): void {}

	showRegister() {
		this.modalService.open(this.tpl, { windowClass: 'modal-login', size: 'sm', centered: true });
	}

	makeRegister() {
		this.submitted = false;
		if (this.form.invalid) {
			return;
		}
		this.authenticationService.createUser(this.form.value, null).subscribe(
			(respuesta: any) => {
				this.showLogin();
				this.noti.mensaje('Registro exitoso!', 'Por favor inicie sesión con sus datos de registro.', 'success');
				// this.router.navigate(['admin/peliculas-listado'] {
				// 	queryParams: { register: 'true' }
				// });
				this.modalService.dismissAll();
			},
			(error) => {
				this.noti.msjValidacion(error);
			}
		);
	}

	onReset(): void {
		this.form.reset();
	}

	showLogin() {
		this.modalService.dismissAll();
		setTimeout(() => {
			this.sharedService.runSubscriptionModalLogin();
		}, 200);
	}

	getRoles() {
		this.generic
			.list('rol/')
			.pipe(takeUntil(this.destroy$))
			.subscribe(
				(data: any) => {
					this.roles = data;
				},
				(error: any) => {
					this.noti.msjValidacion(error);
				}
			);
	}

	errorHandling(control: string, error: string): any {
		return this.form.controls[control].hasError(error) && this.form.controls[control].touched;
	}

	// Sign in with Facebook
	async FacebookReg() {
		const fb = await this.authenticationService.FacebookAuth();
		let mail: string;
		if (typeof fb.email != undefined) {
			mail = fb.email;
		} else {
			mail = fb.user.email;
		}
		this.authenticationService.createUser(null, { app: 'facebook', token: fb.credential.accessToken, email: mail }).subscribe(
			(respuesta: any) => {
				this.showLogin();
				this.noti.mensaje('Registro exitoso!', 'Por favor inicie sesión con su cuenta de Facebook.', 'success');
				// this.router.navigate(['admin/peliculas-listado'] {
				// 	queryParams: { register: 'true' }
				// });
				this.modalService.dismissAll();
			},
			(error) => {
				this.error = error;
				this.noti.msjValidacion(error);
			}
		);
	}

	// Sign in with Google
	async GoogleReg() {
		const go = await this.authenticationService.GoogleAuth();
		this.authenticationService.createUser(null, { app: 'google', token: go.credential.accessToken }).subscribe(
			(respuesta: any) => {
				this.showLogin();
				this.noti.mensaje('Registro exitoso!', 'Por favor inicie sesión con su cuenta de Google.', 'success');
				// this.router.navigate(['admin/peliculas-listado'] {
				// 	queryParams: { register: 'true' }
				// });
				this.modalService.dismissAll();
			},
			(error) => {
				this.error = error;
				this.noti.msjValidacion(error);
			}
		);
	}
}
