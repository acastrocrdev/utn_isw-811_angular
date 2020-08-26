import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService } from 'src/app/share/notificacion.service';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'app-inicio-ubicaciones',
	templateUrl: './inicio.component.html',
	styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
	serverResponse: any;
	destroy$: Subject<boolean> = new Subject<boolean>();
	img_path: string;

	constructor(private apiConn: GenericService, private noti: NotificacionService) {
		this.img_path = environment.locationsPath;
	}

	ngOnInit(): void {
		this.getList();
	}

	getList(): void {
		this.apiConn
			.list('locations')
			.pipe(takeUntil(this.destroy$))
			.subscribe(
				(data: any) => {
					this.serverResponse = data;
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

	goToLink(dest: string, loc: any): void {
		console.log(loc);
		switch (dest) {
			case 'waze':
				window.open('https://waze.com/ul?ll=' + loc.waze + '&navigate=yes&zoom=17', '_blank');
				break;
			case 'gmaps':
				window.open('https://goo.gl/maps/' + loc.google_maps, '_blank');
				break;
		}
	}
}
