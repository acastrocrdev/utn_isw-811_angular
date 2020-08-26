import { Component, OnInit, Input } from '@angular/core';
import { GenericService } from '../generic.service';
import { NotificacionService } from '../notificacion.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
	selector: 'app-rating',
	templateUrl: './rating.component.html',
	styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {
	@Input() to_rating: any; // tipo de elemento a calificar, ejm: pelicula, productos
	@Input() code: any; // Codigo a calificar
	@Input() ranking: number; // suma de votos
	@Input() votes: number; // Numeros de votos
	prueba = -1;
	vote_send: boolean;
	actualRanking = 0;
	serverResponse: any;
	error: any;
	destroy$: Subject<boolean> = new Subject<boolean>();

	constructor(private apiConn: GenericService, private noti: NotificacionService) {}

	ngOnInit(): void {
		this.actualRanking = this.ranking / this.votes;
		this.actualRanking = Math.round((this.actualRanking + Number.EPSILON) * 10) / 10;
		this.vote_send = false;
		if (isNaN(this.actualRanking)) {
			this.actualRanking = 0;
			this.ranking = 0;
			this.votes = 0;
		}
	}

	makeRating(id: any): void {
		this.prueba = id;
	}

	makeClick(value: number): void {
		let vote = {};
		let route = '';
		switch (this.to_rating) {
			case 'product':
				route = 'products/ranking/';
				vote = { product_id: this.code, vote: value };
				break;
			case 'movie':
				route = 'movies/ranking/';
				vote = { movie_id: this.code, vote: value };
				break;
		}
		this.apiConn
			.create(route, vote)
			.pipe(takeUntil(this.destroy$))
			.subscribe(
				(data: any) => {
					this.serverResponse = data;
					this.vote_send = true;
				},
				(error: any) => {
					this.noti.msjValidacion(error);
				}
			);
		this.actualRanking = (value + this.ranking) / (this.votes + 1);
		this.actualRanking = Math.round((this.actualRanking + Number.EPSILON) * 10) / 10;
	}
}
