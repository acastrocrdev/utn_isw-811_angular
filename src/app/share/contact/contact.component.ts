import { Component, OnInit } from '@angular/core';
import { GenericService } from '../generic.service';
import { NotificacionService } from '../notificacion.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
	selector: 'app-contact',
	templateUrl: './contact.component.html',
	styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
	destroy$: Subject<boolean> = new Subject<boolean>();
	fullname: string;
	phone: string;
	mail_sender: string;
	message: string;
	sendMsg: boolean;

	constructor(private apiConn: GenericService, private noti: NotificacionService) {
		this.sendMsg = false;
	}

	ngOnInit(): void {}

	sendMail(): void {
		let data = {
			fullname: this.fullname,
			phone: this.phone,
			email: this.mail_sender,
			message: this.message
		};
		this.apiConn
			.create('send_mail/', data)
			.pipe(takeUntil(this.destroy$))
			.subscribe(
				(data: any) => {
					this.sendMsg = true;
					this.noti.mensaje('Éxito!!!', 'Su mensaje ha sido enviado, pronto le estaremos contactando.', 'success');
				},
				(error: any) => {
					this.noti.msjValidacion(error);
				}
			);
	}
}
