import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService } from 'src/app/share/notificacion.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'app-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
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
		this.img_path = environment.moviesPath;
	}

	ngOnInit(): void {
		this.startDT();
		this.getListToDT();
	}

	ngAfterViewInit(): void {
		this.listenActions = this.renderer.listen('document', 'click', (event) => {
			if (event.target.hasAttribute('show-element-id')) {
				this.goToEdit(event.target.getAttribute('show-element-id'));
			}
		});
	}

	startDT(): void {
		this.dtOptions = {
			pagingType: 'full_numbers',
			lengthChange: true,
			pageLength: 10,
			processing: false,
			autoWidth: false
			// order: [2, 'asc'],
		};
	}

	getListToDT(): void {
		this.apiConn
			.list('reservation/user')
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

	goToEdit(id: any) {
		this.router.navigate(['reservas/detalle/', id]);
	}

	ngOnDestroy(): void {
		this.listenActions();
		this.dtTrigger$.unsubscribe();
	}
}
