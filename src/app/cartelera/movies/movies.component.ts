import { Component, OnInit } from '@angular/core';
import { ArrSplitPipe } from 'src/app/share/arr-split.pipe';
import { GenericService } from './../../share/generic.service';
import { NotificacionService } from './../../share/notificacion.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'app-movies',
	templateUrl: './movies.component.html',
	styleUrls: ['./movies.component.css'],
	providers: [ArrSplitPipe]
})
export class MoviesComponent implements OnInit {
	serverResponse: any;
	error: any;
	destroy$: Subject<boolean> = new Subject<boolean>();

	constructor(public arrSplit: ArrSplitPipe, private apiConn: GenericService, private noti: NotificacionService) {}

	ngOnInit(): void {
		this.getList();
	}

	ngOnDestroy(): void {
		this.destroy$.next(true);
		this.destroy$.unsubscribe();
	}

	getList(): void {
		this.apiConn
			.list('movies')
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
