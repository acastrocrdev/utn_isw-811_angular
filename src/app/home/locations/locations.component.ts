import { Component, OnInit } from '@angular/core';
import { ArrSplitPipe } from 'src/app/share/arr-split.pipe';
import { Subject } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService } from 'src/app/share/notificacion.service';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'app-locations',
	templateUrl: './locations.component.html',
	styleUrls: ['./locations.component.css'],
	providers: [ArrSplitPipe]
})
export class LocationsComponent implements OnInit {
	serverResponse: any;
	destroy$: Subject<boolean> = new Subject<boolean>();

	constructor(public arrSplit: ArrSplitPipe, private apiConn: GenericService, private noti: NotificacionService) {}

	ngOnInit(): void {
		this.getList();
		// {
		// 	location_id: '1',
		// 	img_src: 'alajuela.jpg',
		// 	title: 'Alajuela',
		// 	tags: 'Cerca de los Manudos!!!',
		// 	detail: 'De la rotonda ubicada a la salida de la Radial del Coyol, 600 metros hacia Siquiares. Contamos con 250 campos para su comodidad.'
		// }
	}

	ngOnDestroy(): void {
		this.destroy$.next(true);
		this.destroy$.unsubscribe();
	}

	getList(): void {
		this.apiConn
			.list('locations')
			.pipe(takeUntil(this.destroy$))
			.subscribe(
				(data: any) => {
					this.serverResponse = data;
				},
				(error: any) => {
					this.noti.msjValidacion(error);
				}
			);
	}
}
