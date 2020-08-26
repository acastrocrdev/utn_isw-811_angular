import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthenticationService } from 'src/app/share/authentication.service';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService } from 'src/app/share/notificacion.service';
import { DatePipe } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-detail',
	templateUrl: './detail.component.html',
	styleUrls: ['./detail.component.css'],
	providers: [DatePipe]
})
export class DetailComponent implements OnInit {
	@ViewChild('invoice') invoice: ElementRef;
	destroy$: Subject<boolean> = new Subject<boolean>();
	resId: any;
	currentUser: any;
	myAngularxQrCode: string = null;
	claveFE = ['506130820003101610198', '001000240100', '', '200000000'];
	dataBuy: any;
	ticket: any;
	print: boolean = false;
	pdf: any;
	readyPdf: boolean = false;
	showSend: boolean = false;

	constructor(private auth: AuthenticationService, private apiConn: GenericService, private noti: NotificacionService, private datePipe: DatePipe, private rout: ActivatedRoute) {
		this.auth.currentUser.subscribe((user) => {
			this.currentUser = user;
		});
		this.resId = +this.rout.snapshot.paramMap.get('id');
		this.dataBuy = {
			id: '',
			movie: '',
			datetime: '',
			location: '',
			list: [],
			subtotal: 0,
			iva: 0,
			total: 0
		};
	}

	ngOnInit(): void {
		let toRecep = JSON.parse(localStorage.getItem('actualSale'));
		if (toRecep != null) {
			this.dataBuy = {
				id: toRecep.res_id,
				movie: toRecep.bill.movies.name,
				datetime: this.datePipe.transform(toRecep.bill.date, 'd-M-y') + ' / ' + this.datePipe.transform('2000/01/01 ' + toRecep.bill.time, 'shortTime'),
				location: toRecep.bill.locations.name,
				list: [],
				subtotal: 0,
				iva: 0,
				total: 0
			};
			toRecep.buyList.map((obj) => {
				if (obj.type == 'product') {
					this.dataBuy.list.push({
						description: obj.description,
						quanty: obj.quanty,
						amount: obj.subtotal
					});
				} else {
					this.dataBuy.list.push({
						description: obj.description,
						quanty: obj.quanty,
						amount: obj.subtotal
					});
				}
				this.dataBuy.subtotal += obj.subtotal;
			});
			this.claveFE = this.LeftPadWithZeros('set_array', 1, 8, this.claveFE, 2);
			this.ticket = this.LeftPadWithZeros('ret', this.dataBuy.id, 8, null, null);
			this.dataBuy.iva = this.dataBuy.subtotal * 0.13;
			this.dataBuy.total = this.dataBuy.subtotal + this.dataBuy.iva;
			this.myAngularxQrCode = toRecep.bill.movies.site;
			setTimeout(() => {
				this.generatePdf();
				localStorage.removeItem('actualSale');
			}, 1000);
		} else {
			this.getData();
		}
	}

	getData(): void {
		this.apiConn
			.get('reservation/details', this.resId)
			.pipe(takeUntil(this.destroy$))
			.subscribe(
				(data: any) => {
					this.processResSave(data);
				},
				(error: any) => {
					this.noti.msjValidacion(error);
				}
			);
	}

	processResSave(data): void {
		this.dataBuy = {
			id: data.id,
			movie: data.mov_name,
			datetime: this.datePipe.transform(data.date, 'd-M-y') + ' / ' + this.datePipe.transform('2000/01/01 ' + data.time, 'shortTime'),
			location: data.loc_name,
			list: [],
			subtotal: 0,
			iva: 0,
			total: 0
		};
		data.reservation_ticket.map((obj) => {
			this.dataBuy.list.push({
				description: obj.name,
				quanty: obj.quanty,
				amount: obj.amount
			});
			this.dataBuy.subtotal += obj.amount * obj.quanty;
		});

		data.reservation_product.map((obj) => {
			this.dataBuy.list.push({
				description: obj.name,
				quanty: obj.quanty,
				amount: obj.amount
			});
			this.dataBuy.subtotal += obj.amount * obj.quanty;
		});

		this.claveFE = this.LeftPadWithZeros('set_array', 1, 8, this.claveFE, 2);
		this.ticket = this.LeftPadWithZeros('ret', this.dataBuy.id, 8, null, null);
		this.dataBuy.iva = this.dataBuy.subtotal * 0.13;
		this.dataBuy.total = this.dataBuy.subtotal + this.dataBuy.iva;
		this.myAngularxQrCode = 'Reimpresion de comprobante';
		this.showSend = true;
	}

	sendTicket(): void {
		let formData = new FormData();
		formData.append('movie_name', this.dataBuy.movie);
		formData.append('movie_date', this.dataBuy.datetime);
		formData.append('movie_location', this.dataBuy.location);
		var pdfBin = this.pdf.output('blob');
		formData.append('ticket', pdfBin, 'ticket.pdf');
		this.apiConn.create_formdata('send_ticket', formData).subscribe(
			(respuesta: any) => {
				this.noti.mensaje('', 'Hemos enviado el tiquete a su correo electronico', 'success');
			},
			(error) => {
				this.noti.msjValidacion('Se ha presentado un error al enviar su compobante al correo, por favor descarguelo aqui.');
			}
		);
	}

	generatePdf(): void {
		if (!this.readyPdf) {
			this.print = true;
			window.scrollTo(0, 0);
			html2canvas(this.invoice.nativeElement, { scale: 1, scrollX: 0, scrollY: 0 }).then((canvas) => {
				var imgWidth = 308;
				var imgHeight = (canvas.height * imgWidth) / canvas.width;
				var imgData = canvas.toDataURL('image/jpeg', 1.0);
				this.pdf = new jsPDF('p', 'mm', [imgWidth, imgHeight]);
				this.pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
				this.print = false;
				this.readyPdf = true;
				setTimeout(() => {
					this.sendTicket();
				}, 2000);
			});
		}
	}

	openPdf(): void {
		this.pdf.save('ticket.pdf');
	}

	LeftPadWithZeros(mode: string, id: any, length: any, obj: any, indObj: any): any {
		var str = '' + id;
		while (str.length < length) {
			str = '0' + str;
		}
		if (mode == 'set_array') {
			obj[indObj] = str;
			return obj;
		} else {
			return str;
		}
	}

	getDateActual(): string {
		var d = new Date();
		return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + ' - ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
	}
}
