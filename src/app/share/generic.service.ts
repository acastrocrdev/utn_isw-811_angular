import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';

@Injectable({
	providedIn: 'root'
})
export class GenericService {
	// URL del API, definida en enviroments->enviroment.ts
	urlAPI: string = environment.apiURL;
	apiMoviesDB: string = environment.apiMoviesDB;
	keyMoviesDB: string = environment.keyMoviesDB;
	//Información usuario actual
	currentUser: any;
	//Headers a inclur en las solicitudes, opcional, solo cuando es necesario
	headers = new HttpHeaders();
	headers_mp = new HttpHeaders();
	//Inyectar cliente HTTP para las solicitudes al API
	// Personalización de errores
	//Servicio de autentificación
	constructor(private http: HttpClient, private authenticationService: AuthenticationService) {
		// Reg Headers
		this.headers = new HttpHeaders();
		this.headers = this.headers.set('Content-Type', 'application/json; charset=utf-8');
		// this.headers = this.headers.set('Access-Control-Allow-Origin', 'https://desarrollo.crdevelopers.com:4200');
		this.headers = this.headers.set('Access-Control-Allow-Origin', '*');
		// this.headers = this.headers.append('Access-Control-Allow-Origin', '*');
		// Multipart headers
		this.headers_mp = new HttpHeaders();
		this.headers_mp = this.headers_mp.append('processData', 'false');
		this.headers_mp = this.headers_mp.append('mimeType', 'multipart/form-data');
		this.headers_mp = this.headers_mp.append('contentType', 'false');
		this.headers_mp = this.headers_mp.append('Access-Control-Allow-Origin', '*');
		this.authenticationService.currentUser.subscribe((x) => {
			this.currentUser = x;
			if (this.currentUser) {
				if (this.currentUser.access_token) {
					// Reg Headers
					if (this.headers.has('Authorization')) {
						this.headers = this.headers.delete('Authorization');
					}
					this.headers = this.headers.append('Authorization', 'Bearer ' + this.currentUser.access_token);
					// Multipart-headers
					if (this.headers_mp.has('Authorization')) {
						this.headers_mp = this.headers_mp.delete('Authorization');
					}
					this.headers_mp = this.headers_mp.append('Authorization', 'Bearer ' + this.currentUser.access_token);
				}
			}
		});
	}

	// Listar
	list(endopoint: string): Observable<any> {
		return this.http.get<any>(this.urlAPI + endopoint, { headers: this.headers });
	}

	// Obtener
	get(endopoint: string, filtro: any): Observable<any | any[]> {
		let pars = '';
		if (typeof filtro == 'object') {
			for (let index = 0; index < filtro.length; index++) {
				pars = `/${filtro[index]}`;
			}
		} else {
			pars = `/${filtro}`;
		}
		return this.http.get<any | any[]>(this.urlAPI + endopoint + pars, {
			headers: this.headers
		});
	}

	// crear
	create(endopoint: string, objCreate: any | any): Observable<any | any[]> {
		if (this.currentUser != null) {
			objCreate.user_id = this.currentUser.user.id;
		}
		return this.http.post<any | any[]>(this.urlAPI + endopoint, objCreate, {
			headers: this.headers
		});
	}

	// actualizar
	update(endopoint: string, objUpdate: any | any): Observable<any | any[]> {
		return this.http.patch<any | any[]>(this.urlAPI + endopoint + `/${objUpdate.id}`, objUpdate, { headers: this.headers });
	}

	// crear
	create_formdata(endopoint: string, objCreate: FormData | any): Observable<any | any[]> {
		if (this.currentUser != null) {
			objCreate.append('user_id', this.currentUser.user.id);
		}
		return this.http.post<any | any[]>(this.urlAPI + endopoint, objCreate, {
			headers: this.headers_mp
		});
	}

	// actualizar
	update_formdata(endopoint: string, objUpdate: FormData | any): Observable<any | any[]> {
		return this.http.post<any | any[]>(this.urlAPI + endopoint + `/${objUpdate.get('id')}` + '?_method=PATCH', objUpdate, {
			headers: this.headers_mp
		});
	}

	// Listar
	getMovieInfo(type: string, code: string): Observable<any> {
		let query = '';
		switch (type) {
			case 'movies_list':
				query = `/search/movie?api_key=${this.keyMoviesDB}&language=es-MX&query=${code}&page=1&include_adult=true&region=MX`;
				break;
			case 'movies_data':
				query = `/movie/${code}?api_key=${this.keyMoviesDB}&language=es-MX`;
				break;
			case 'movies_cert':
				query = `/movie/${code}/release_dates?api_key=${this.keyMoviesDB}`;
				break;
			case 'movies_video':
				query = `/movie/${code}/videos?api_key=${this.keyMoviesDB}&language=es-MX`;
				break;
			case 'movies_rs':
				query = `/movie/${code}/external_ids?api_key=${this.keyMoviesDB}`;
				break;
		}
		// headers: this.headers
		return this.http.get<any>(this.apiMoviesDB + query, {});
	}
}
