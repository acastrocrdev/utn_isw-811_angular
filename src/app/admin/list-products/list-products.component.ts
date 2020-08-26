import { Component, OnInit, ViewChild, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService } from 'src/app/share/notificacion.service';
import { DataTableDirective } from 'angular-datatables';

@Component({
	selector: 'app-list-products',
	templateUrl: './list-products.component.html',
	styleUrls: ['./list-products.component.css']
})
export class ListProductsComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild(DataTableDirective, { static: false })
	dtOptions: DataTables.Settings = {};
	dtTrigger$: Subject<any> = new Subject();
	dtElement: DataTableDirective;
	serverResponseCategories: any;
	error: any;
	serverResponse$: any[] = [];
	img_path: string;
	isDtInitialized: boolean = false;
	listenActions: any;

	constructor(private apiConn: GenericService, private noti: NotificacionService, private router: Router, private route: ActivatedRoute, private renderer: Renderer2) {
		this.img_path = environment.productPath;
	}

	ngOnInit(): void {
		this.startDT();
		this.getListToDT();
	}

	ngAfterViewInit(): void {
		this.listenActions = this.renderer.listen('document', 'click', (event) => {
			if (event.target.hasAttribute('edit-element-id')) {
				this.goToEdit(event.target.getAttribute('edit-element-id'));
			}
			if (event.target.hasAttribute('hidden-element-id')) {
				this.HiddeReg(event.target.getAttribute('hidden-element-id'));
			}

			if (event.target.hasAttribute('show-element-id')) {
				this.showReg(event.target.getAttribute('show-element-id'));
			}
		});
	}

	startDT(): void {
		this.dtOptions = {
			pagingType: 'full_numbers',
			lengthChange: true,
			pageLength: 10,
			processing: false,
			autoWidth: false,
			// order: [2, 'asc'],
			columns: [
				{
					title: 'Imagen',
					data: 'id'
				},
				{
					title: 'Nombre',
					data: 'name'
				},
				{
					title: 'Descripción',
					data: 'description'
				},
				{
					title: 'Precio',
					data: 'amount'
				},
				{
					title: 'Estado',
					data: 'enable'
				},
				{
					title: 'Opciones',
					data: 'options',
					render: (data, type, full) => {
						return;
					}
				}
			]
		};
	}

	getListToDT(): void {
		this.apiConn
			.list('products/all')
			.pipe(takeUntil(this.dtTrigger$))
			.subscribe(
				(data: any) => {
					this.serverResponse$ = data;
					if (this.isDtInitialized) {
					} else {
						this.isDtInitialized = true;
						this.dtTrigger$.next();
					}
				},
				(error: any) => {
					this.noti.msjValidacion(error);
					this.dtTrigger$.next([]);
				}
			);
	}

	showReg(id: any): void {
		this.noti.mensaje('', 'Guardando su solicitud.', 'info');
		this.apiConn.update('products/enable', { id: id }).subscribe(
			(respuesta: any) => {
				this.noti.mensaje('', 'El registro ahora esta visible', 'success', 5);
				this.getListToDT();
			},
			(error) => {
				this.noti.msjValidacion(error);
			}
		);
	}

	HiddeReg(id: any): void {
		this.noti.mensaje('', 'Guardando su solicitud.', 'info');
		this.apiConn.update('products/disable', { id: id }).subscribe(
			(respuesta: any) => {
				this.noti.mensaje('', 'El registro ahora esta oculto', 'success', 5);
				this.getListToDT();
			},
			(error) => {
				this.noti.msjValidacion(error);
			}
		);
	}
	deleteReg(id: any): void {}

	goToEdit(id: any) {
		this.router.navigate(['admin/productos-editar/', id]);
	}

	ngOnDestroy(): void {
		this.listenActions();
		this.dtTrigger$.unsubscribe();
	}
}
