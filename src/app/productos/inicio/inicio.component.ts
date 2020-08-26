import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService } from 'src/app/share/notificacion.service';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-inicio-productos',
	templateUrl: './inicio.component.html',
	styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
	serverResponse: any;
	serverResponse_order: any;
	productsClone: any;
	filterProdCode: any = '';
	serverResponseCategories: any;
	error: any;
	destroy$: Subject<boolean> = new Subject<boolean>();
	destroyCats$: Subject<boolean> = new Subject<boolean>();
	img_path: string;

	constructor(private apiConn: GenericService, private noti: NotificacionService) {
		this.img_path = environment.productPath;
	}

	ngOnInit(): void {
		this.getList();
		this.getCategories();
	}

	getCategories(): void {
		this.apiConn
			.list('products/classifications')
			.pipe(takeUntil(this.destroyCats$))
			.subscribe(
				(data: any) => {
					this.serverResponseCategories = data;
					this.destroyCats$.next(true);
					this.destroyCats$.unsubscribe();
				},
				(error: any) => {
					this.noti.msjValidacion(error);
					this.destroyCats$.next(true);
					this.destroyCats$.unsubscribe();
				}
			);
	}

	getList(): void {
		this.apiConn
			.list('products')
			.pipe(takeUntil(this.destroy$))
			.subscribe(
				(data: any) => {
					this.serverResponse = data;
					this.productsClone = data;
					this.sortProduct();
					this.destroy$.next(true);
					this.destroy$.unsubscribe();
				},
				(error: any) => {
					this.noti.msjValidacion(error);
					this.destroy$.next(true);
					this.destroy$.unsubscribe();
				}
			);
	}

	filterProds(id: any): void {
		if (id == 0) {
			this.productsClone = this.serverResponse;
		} else {
			this.productsClone = [];
			this.serverResponse.map((prod) => {
				if (
					prod.classification_prod.some((cat) => {
						return cat.id == id;
					}) == true
				) {
					this.productsClone.push(prod);
				}
			});
		}
	}

	sortProduct(): void {
		this.serverResponse_order = JSON.parse(JSON.stringify(this.serverResponse));
		this.serverResponse_order.sort((a, b) => {
			let val_1 = a.ranking_product_sum / a.ranking_product_count || 0;
			let val_2 = b.ranking_product_sum / b.ranking_product_count || 0;
			return val_1 < val_2 ? 1 : -1;
		});
	}
}
