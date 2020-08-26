import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService } from 'src/app/share/notificacion.service';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';

@Component({
	selector: 'app-detalle',
	templateUrl: './detalle.component.html',
	styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
	serverResponse: any;
	serverResponseCategories: any;
	error: any;
	showContent: boolean = false;
	destroy$: Subject<boolean> = new Subject<boolean>();
	destroyCats$: Subject<boolean> = new Subject<boolean>();
	img_path: string;

	constructor(private apiConn: GenericService, private noti: NotificacionService, private route: ActivatedRoute, private location: Location) {
		this.img_path = environment.productPath;
	}

	ngOnInit(): void {
		let id = +this.route.snapshot.paramMap.get('id');
		this.getProduct(id);
		this.getCategories();
		this.showContent = false;
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

	getProduct(id: any): void {
		this.apiConn
			.get('products', id)
			.pipe(takeUntil(this.destroy$))
			.subscribe(
				(data: any) => {
					this.serverResponse = data;
					this.destroy$.next(true);
					this.destroy$.unsubscribe();
					this.showContent = true;
				},
				(error: any) => {
					this.noti.msjValidacion(error);
					this.destroy$.next(true);
					this.destroy$.unsubscribe();
				}
			);
	}

	agregarCarrito(id: any): void {}

	backPage() {
		this.location.back();
	}
}
