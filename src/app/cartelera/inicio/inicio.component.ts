import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService } from 'src/app/share/notificacion.service';
import { takeUntil } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import Lity from 'lity';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-inicio-cartelera',
	templateUrl: './inicio.component.html',
	styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
	serverResponse: any;
	serverResponse_order: any;
	error: any;
	show_btns: boolean;
	img_src: string;
	destroy$: Subject<boolean> = new Subject<boolean>();
	moviesPath = environment.moviesPath;

	constructor(private apiConn: GenericService, private noti: NotificacionService, private _sanitizer: DomSanitizer) {}

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
					this.sortMovies();
				},
				(error: any) => {
					this.noti.msjValidacion(error);
				}
			);
	}

	showBtns(): void {
		this.show_btns = true;
	}

	hiddenBtns(): void {
		this.show_btns = false;
	}

	viewTeaser(movie: any): void {
		Lity('https://www.youtube.com/embed/' + movie.teaser + '?autoplay=1');
	}

	viewTrailer(movie: any): void {
		Lity('https://www.youtube.com/embed/' + movie.trailer + '?autoplay=1');
	}

	goToLink(dest: string, movieObj: any): void {
		switch (dest) {
			case 'face':
				window.open('https://www.facebook.com/' + movieObj.facebook_id, '_blank');
				break;
			case 'inst':
				window.open('https://www.instagram.com/' + movieObj.instagram_id, '_blank');
				break;
			case 'twit':
				window.open('https://twitter.com/' + movieObj.twitter_id, '_blank');
				break;
			case 'page':
				window.open(movieObj.site, '_blank');
				break;
		}
	}

	getVideoIframe(url: string) {
		let results: any;
		if (url === null) {
			return '';
		}
		results = url.match('[\\?&]v=([^&#]*)');
		let video = results === null ? url : results[1];
		return this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video + '?autoplay=1');
	}

	sortMovies(): void {
		this.serverResponse_order = JSON.parse(JSON.stringify(this.serverResponse));
		this.serverResponse_order.sort((a, b) => {
			let val_1 = a.ranking_sum / a.ranking_count || 0;
			let val_2 = b.ranking_sum / b.ranking_count || 0;
			return val_1 < val_2 ? 1 : -1;
		});
	}
}
