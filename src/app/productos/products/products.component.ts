import { Component, OnInit, OnDestroy } from '@angular/core';
import { ArrSplitPipe } from './../../share/arr-split.pipe';
import { Subject } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService } from 'src/app/share/notificacion.service';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'app-products',
	templateUrl: './products.component.html',
	styleUrls: ['./products.component.css'],
	providers: [ArrSplitPipe]
})
export class ProductsComponent implements OnInit, OnDestroy {
	serverResponse: any;
	productsClone: any;
	filterProdCode: any = '';
	serverResponseCategories: any;
	error: any;
	destroy$: Subject<boolean> = new Subject<boolean>();
	destroyCats$: Subject<boolean> = new Subject<boolean>();

	constructor(public arrSplit: ArrSplitPipe, private apiConn: GenericService, private noti: NotificacionService) {}

	ngOnInit(): void {
		this.getList();
		this.getCategories();
		// {
		// 	product_id: '1',
		// 	img_src: 'hamburguesa.png',
		// 	title: 'Hamburguesas sencilla',
		// 	tags: 'Deliciosa hamburguesa sencilla, con carne a la parrilla, queso y mucho sabor',
		// 	price: '¢1,900.00',
		// 	product_rank: 100,
		// 	product_votes: 20
		// }
	}

	ngOnDestroy(): void {
		this.destroyCats$.next(true);
		this.destroyCats$.unsubscribe();
		this.destroy$.next(true);
		this.destroy$.unsubscribe();
	}

	getCategories(): void {
		this.apiConn
			.list('products/classifications')
			.pipe(takeUntil(this.destroyCats$))
			.subscribe(
				(data: any) => {
					this.serverResponseCategories = data;
				},
				(error: any) => {
					this.noti.msjValidacion(error);
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
				},
				(error: any) => {
					this.noti.msjValidacion(error);
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
}
