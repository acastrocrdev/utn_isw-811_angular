import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService } from 'src/app/share/notificacion.service';
import { CustomCurrencyPipe } from 'src/app/share/custom-currency.pipe';
import { Subject } from 'rxjs';

@Component({
	selector: 'app-inicio-resevas',
	templateUrl: './inicio.component.html',
	styleUrls: ['./inicio.component.css'],
	providers: [CustomCurrencyPipe]
})
export class InicioComponent implements OnInit, AfterViewInit {
	serverResponse$: any[] = [];
	destroy$: Subject<boolean> = new Subject<boolean>();
	moviesPath = environment.moviesPath;
	movie_id: any = false;
	location_id: any = false;
	bill_id: any = false;
	billboard: any = null;
	ticket: any = [];
	products: any = [];
	buyList: any = [];
	showContent: any = false;
	initTables: boolean = false;
	subtotal: number = 0;
	taxes: number = 0;
	total: number = 0;
	haveItems: boolean = false;

	constructor(private apiConn: GenericService, private noti: NotificacionService, private route: ActivatedRoute, private router: Router, private location: Location) {
		this.showContent = false;
		this.route.queryParams.subscribe((params) => {
			this.bill_id = params.bill || false;
			this.movie_id = params.movie || false;
			this.location_id = params.loc || false;
		});
		if (this.bill_id && this.movie_id) {
			this.getlocations();
		} else if (this.location_id) {
			this.router.navigate(['/home/' + this.location_id]);
		} else {
			this.router.navigate(['/home']);
		}
	}

	ngOnInit(): void {}

	ngAfterViewInit(): void {}

	getlocations(): void {
		this.apiConn
			.get('billboards', this.bill_id)
			// .pipe(takeUntil(this.dtTrigger$))
			.subscribe(
				(data: any) => {
					this.billboard = data[0];
					this.ticket = data.ticket;
					this.products = data.product;
					this.showContent = true;
				},
				(error: any) => {
					this.noti.msjValidacion(error);
				}
			);
	}

	getList(): void {}

	backPage() {
		this.location.back();
	}

	saveSale() {
		let prod = [];
		let tick = [];
		this.buyList.map((obj) => {
			if (obj.type == 'product') {
				prod.push({
					product_id: obj.id,
					quanty: obj.quanty,
					amount: obj.total_amount
				});
			} else {
				tick.push({
					ticket_id: obj.id,
					quanty: obj.quanty,
					amount: obj.total_amount
				});
			}
		});
		let objSave = {
			billboard_id: this.billboard.id,
			products: prod,
			tickets: tick,
			res_id: 0
		};
		this.apiConn
			.create('reservation/', objSave)
			.pipe(takeUntil(this.destroy$))
			.subscribe(
				(data: any) => {
					let toRecep = {
						bill: this.billboard,
						res_id: data.id,
						buyList: this.buyList
					};
					localStorage.setItem('actualSale', JSON.stringify(toRecep));
					this.noti.mensaje('Éxito!!!', data.msg, 'success');
					this.router.navigate(['reservas/detalle/' + data.id]);
				},
				(error: any) => {
					this.noti.msjValidacion(error);
				}
			);
	}

	updateAmount(dat: any): void {
		if (dat.availabe - dat.currentSold >= dat.total) {
			dat.total_amount = dat.total * dat.amount;
		} else {
			dat.total = dat.availabe - dat.currentSold;
			dat.total_amount = dat.total * dat.amount;
		}
		this.updateTotal();
	}

	updateAmountProd(dat: any): void {
		if (50 >= dat.total) {
			dat.total_amount = dat.total * dat.amount;
		} else {
			dat.total = 50;
			dat.total_amount = dat.total * dat.amount;
		}
		this.updateTotal();
	}

	updateTotal(): void {
		this.buyList = [];
		this.subtotal = 0;
		this.taxes = 0;
		this.total = 0;
		this.ticket.map((obj) => {
			this.subtotal += obj.total_amount;
			this.taxes = this.subtotal * 0.13;
			this.total = this.subtotal + this.taxes;
			if (obj.total > 0) {
				this.buyList.push({
					id: obj.id,
					type: 'ticket',
					description: obj.name,
					quanty: obj.total,
					subtotal: obj.total_amount,
					iva: obj.total_amount * 0.13,
					total: obj.total_amount + obj.total_amount * 0.13
				});
			}
		});
		this.products.map((obj) => {
			this.subtotal += obj.total_amount;
			this.taxes = this.subtotal * 0.13;
			this.total = this.subtotal + this.taxes;
			if (obj.total > 0) {
				this.buyList.push({
					id: obj.id,
					type: 'product',
					description: obj.name,
					quanty: obj.total,
					subtotal: obj.total_amount,
					iva: obj.total_amount * 0.13,
					total: obj.total_amount + obj.total_amount * 0.13
				});
			}
		});
		if (this.buyList.length > 0) this.haveItems = true;
		else this.haveItems = false;
	}

	duration(dur: any): string {
		if (dur != null) {
			var hours = Math.floor(dur / 60);
			var minutes = dur % 60;
			return hours + ' hora y ' + minutes + ' minutos';
		} else {
			return 'No disponible';
		}
	}
}
