import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
//Está definición puede ser una clase o interfaz
//Establece la estructura general de un error
export interface IError {
	error: {
		message: string;
		errors: { field: string; message: string }[];
	};
	message: string;
	name: string;
	ok: boolean;
	status: number;
	statusText: string;
}
@Injectable({
	providedIn: 'root'
})
export class CustomHandlerErrorService {
	constructor() {}
	//Capturar el error y darle formato, además de personalizar el mensaje cuando sea necesario
	public handleError(error: IError | HttpErrorResponse) {
		if (error instanceof ErrorEvent) {
			// Ocurrió un error del lado del cliente o de la red.
			console.error('Error: ', error.message);
		}
		let message: string = '';
		let status: number = 200;
		if (error.status === 404) {
			message = 'Recurso no encontrado';
			status = 404;
		}
		if (error.status === 401) {
			message = 'No autorizado';
		}
		if (error.status === 400) {
			message = 'Solicitud incorrecta';
			status = 400;
		}
		error = new HttpErrorResponse({
			error: error.error,
			status: status,
			statusText: message
		});
		return throwError(error);
	}
}
