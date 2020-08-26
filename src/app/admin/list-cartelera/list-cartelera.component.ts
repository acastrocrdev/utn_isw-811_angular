import { Component, OnInit, ViewChild, Renderer2, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService } from 'src/app/share/notificacion.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'app-list-cartelera',
	templateUrl: './list-cartelera.component.html',
	styleUrls: ['./list-cartelera.component.css']
})
export class ListCarteleraComponent implements OnInit, OnDestroy {
	@ViewChild(DataTableDirective, { static: false })
	dtOptions: DataTables.Settings = {};
	dtTrigger$: Subject<any> = new Subject();
	dtElement: DataTableDirective;
	serverResponse$: any[] = [];
	isDtInitialized: boolean = false;
	listenActions: any;

	constructor(private apiConn: GenericService, private noti: NotificacionService, private router: Router, private route: ActivatedRoute, private renderer: Renderer2) {}

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
			if (event.target.hasAttribute('sales-disable-element-id')) {
				this.disableReg(event.target.getAttribute('sales-disable-element-id'));
			}
			if (event.target.hasAttribute('sales-enable-element-id')) {
				this.enableReg(event.target.getAttribute('sales-enable-element-id'));
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
					title: 'Ubicación',
					data: 'location'
				},
				{
					title: 'Nombre',
					data: 'name'
				},
				{
					title: 'Fecha',
					data: 'date'
				},
				{
					title: 'Hora',
					data: 'time'
				},
				{
					title: 'Visible',
					data: 'visible'
				},
				{
					title: 'En venta',
					data: 'sales_enable'
				},
				{
					title: 'Opciones',
					data: 'options',
					orderable: false,
					render: (data, type, full) => {
						return;
					}
				}
			]
		};
	}

	getListToDT(): void {
		this.apiConn
			.list('billboards')
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
		this.apiConn.update('billboards/visible', { id: id }).subscribe(
			(respuesta: any) => {
				this.noti.mensaje('', 'El registro esta visible', 'success', 5);
				// this.router.navigate(['admin/peliculas-listado']);
				this.getListToDT();
			},
			(error) => {
				this.noti.msjValidacion(error);
			}
		);
	}

	HiddeReg(id: any): void {
		this.noti.mensaje('', 'Guardando su solicitud.', 'info');
		this.apiConn.update('billboards/hidden', { id: id }).subscribe(
			(respuesta: any) => {
				this.noti.mensaje('', 'La venta esta oculto', 'success', 5);
				// this.router.navigate(['admin/peliculas-listado']);
				this.getListToDT();
			},
			(error) => {
				this.noti.msjValidacion(error);
			}
		);
	}

	enableReg(id: any): void {
		this.noti.mensaje('', 'Guardando su solicitud.', 'info');
		this.apiConn.update('billboards/sales_enable', { id: id }).subscribe(
			(respuesta: any) => {
				this.noti.mensaje('', 'La venta ahora esta activa', 'success', 5);
				// this.router.navigate(['admin/peliculas-listado']);
				this.getListToDT();
			},
			(error) => {
				this.noti.msjValidacion(error);
			}
		);
	}

	disableReg(id: any): void {
		this.noti.mensaje('', 'Guardando su solicitud.', 'info');
		this.apiConn.update('billboards/sales_disable', { id: id }).subscribe(
			(respuesta: any) => {
				this.noti.mensaje('', 'La venta ahora esta desactivada', 'success', 5);
				// this.router.navigate(['admin/peliculas-listado']);
				this.getListToDT();
			},
			(error) => {
				this.noti.msjValidacion(error);
			}
		);
	}

	deleteReg(id: any): void {}

	goToEdit(id: any) {
		this.router.navigate(['admin/cartelera-editar/', id]);
	}

	ngOnDestroy(): void {
		this.listenActions();
		this.dtTrigger$.unsubscribe();
	}
}
