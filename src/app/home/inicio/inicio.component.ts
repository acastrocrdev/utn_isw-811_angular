import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificacionService } from 'src/app/share/notificacion.service';

@Component({
	selector: 'app-inicio',
	templateUrl: './inicio.component.html',
	styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
	prueba = -1;
	peli = -1;

	constructor(private route: ActivatedRoute, private router: Router, private noti: NotificacionService) {}

	ngOnInit(): void {
		this.mensajes();
	}

	mensajes() {
		let auth = false;
		let role = false;
		let login_expire = false;
		this.route.queryParams.subscribe((params) => {
			auth = params.auth || false;
			role = params.role || false;
			login_expire = params.login_expire || false;
		});
		if (auth) {
			this.noti.mensaje('Usuario', 'Su usuario no esta autorizado.', 'warning');
		}
		if (role) {
			this.noti.mensaje('Permisos de Usuario', 'Usted no tiene permisos de ingresar al recurso solicitado', 'warning');
		}
		if (login_expire) {
			this.noti.mensaje('Cuenta de Usuario', 'Debe iniciar sesión nuevamente', 'warning');
		}
	}
}
