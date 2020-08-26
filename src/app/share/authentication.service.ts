import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';

@Injectable({
	providedIn: 'root'
})
export class AuthenticationService {
	//Header para afirmar el tipo de contenido JSON
	httpOptions = {
		headers: new HttpHeaders({ 'Content-Type': 'application/json' })
	};

	//URL del API
	ServerUrl = environment.apiURL;

	//Variable observable para gestionar la información del usuario, con características especiales
	private currentUserSubject: BehaviorSubject<any>;

	//Variable observable para gestionar la información del usuario
	public currentUser: Observable<any>;
	//Inyectar cliente HTTP para las solicitudes al API
	// Personalización de errores

	public tmpPass: any = null;

	constructor(private http: HttpClient, public afAuth: AngularFireAuth) {
		//Obtener los datos del usuario en localStorage, si existe
		this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
		//Establecer un observable para acceder a los datos del usuario
		this.currentUser = this.currentUserSubject.asObservable();
	}

	//Obtener el valor del usuario actual
	public get currentUserValue(): any {
		return this.currentUserSubject.value;
	}

	//Crear usuario
	createUser(user: any, rs: any): Observable<any> {
		if (rs) {
			return this.http.post<any>(this.ServerUrl + 'auth/register_rs/', rs, this.httpOptions);
		} else {
			return this.http.post<any>(this.ServerUrl + 'auth/register/', user, this.httpOptions);
		}
	}

	//Login
	loginUser(user: any, rs: any): Observable<any> {
		if (rs) {
			return this.http.post<any>(this.ServerUrl + 'auth/login_rs/', rs, this.httpOptions).pipe(
				map((user) => {
					// almacene los detalles del usuario y el token jwt
					// en el almacenamiento local para mantener al usuario conectado entre las actualizaciones de la página;
					localStorage.setItem('currentUser', JSON.stringify(user));
					this.currentUserSubject.next(user);
					return user;
				})
			);
		} else {
			return this.http.post<any>(this.ServerUrl + 'auth/login/', user, this.httpOptions).pipe(
				map((user) => {
					// almacene los detalles del usuario y el token jwt
					// en el almacenamiento local para mantener al usuario conectado entre las actualizaciones de la página;
					localStorage.setItem('currentUser', JSON.stringify(user));
					this.currentUserSubject.next(user);
					return user;
				})
			);
		}
	}

	//Logout de usuario autentificado
	logout() {
		// eliminar usuario del almacenamiento local para cerrar la sesión del usuario
		localStorage.removeItem('currentUser');
		this.currentUserSubject.next(null);
	}

	// Sign in with Facebook
	async FacebookAuth(): Promise<any> {
		return await this.AuthLogin(new auth.FacebookAuthProvider());
	}

	async GoogleAuth(): Promise<any> {
		return await this.AuthLogin(new auth.GoogleAuthProvider());
	}

	// Auth logic to run auth providers
	async AuthLogin(provider): Promise<any> {
		return await this.afAuth
			.signInWithPopup(provider)
			.then((result) => {
				return result;
			})
			.catch((error) => {
				return error;
			});
	}
}
