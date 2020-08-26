import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { NotificacionService } from 'src/app/share/notificacion.service';

@Injectable({
	providedIn: 'root'
})
export class ConnInterceptorService implements HttpInterceptor {
	constructor(private router: Router, private auth: AuthenticationService, private noti: NotificacionService) {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const token: string = localStorage.getItem('token');

		let request = req;
		// console.log('intercept', request);
		if (token) {
			// request = req.clone({
			// 	setHeaders: {
			// 		authorization: `User-Agent: ${token}`
			// 	}
			// });
		}

		return next.handle(request).pipe(
			catchError((err: HttpErrorResponse) => {
				console.log('err', err);
				let status: number = null;
				let message: string = null;
				let changeError: boolean = false;
				console.log(err);
				if (err.status === 400) {
					message = 'Solicitud incorrecta';
					// status = 499;
					this.noti.msjValidacion(err.error, message);
					// this.noti.mensaje(message, `Detalle: ${err.error}`, 'error');
					// changeError = false;
				} else if (err.status === 401) {
					message = 'No autorizado';
					status = 499;
					this.auth.logout();
					this.router.navigate(['/home'], { queryParams: { login_expire: 'true' } });
					changeError = true;
				} else if (err.status === 404) {
					message = 'Recurso no encontrado';
					// status = 499;
					this.noti.msjValidacion(err.error, message);
					// this.noti.mensaje(message, `Detalle: ${err.error}`, 'error');
					// changeError = false;
				} else if (err.status === 422) {
					message = 'Se ha presentado un error';
					// status = 499;
					this.noti.msjValidacion(err.error, message);
					// this.noti.mensaje(message, `Detalle: ${err.error}`, 'error');
					// changeError = false;
				} else if (err.status === 428) {
					message = 'Antes de continuar es necesario que:';
					// status = 499;
					this.noti.msjValidacion(err.error, message);
					// this.noti.mensaje(message, `${err.error}`, 'error');
					// changeError = false;
				} else {
					// message = 'Se ha presentado un error desconocido';
					// status = null;
					// this.noti.mensaje(message, `Detalle: ${err.error} - ${err.message} (Código de error: ${err.status}.`, 'error');
					// changeError = false;
				}
				if (changeError)
					err = new HttpErrorResponse({
						error: err.error,
						status: status || err.status,
						statusText: message || err.statusText
					});
				return throwError(err);
			})
		);
	}
}
