import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SharedService {
	constructor() {}

	private moviePreviewModal = new Subject<any>();
	private idMovieDB = new Subject<any>();
	private loginModal = new Subject<any>();
	private registerModal = new Subject<any>();
	// ***************************************************************************************************************************************
	// Modals
	// ***************************************************************************************************************************************
	// Movie Preview
	runSubscriptionModalMoviePreview(vari: string, obj: any) {
		obj.vari = vari;
		this.moviePreviewModal.next(obj);
	}

	suscribeModalMoviePreview(): Observable<any> {
		return this.moviePreviewModal.asObservable();
	}

	runSubscriptionModalMovieId(movieId: string) {
		this.idMovieDB.next(movieId);
	}

	suscribeModalMovieId(): Observable<any> {
		return this.idMovieDB.asObservable();
	}

	// Login
	runSubscriptionModalLogin() {
		this.loginModal.next();
	}

	suscribeModalLogin(): Observable<any> {
		return this.loginModal.asObservable();
	}

	// Register
	runSubscriptionModalRegister() {
		this.registerModal.next();
	}

	suscribeModalRegister(): Observable<any> {
		return this.registerModal.asObservable();
	}
}
