import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService } from 'src/app/share/notificacion.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import Lity from 'lity';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';

@Component({
	selector: 'app-movies-detail',
	templateUrl: './movies-detail.component.html',
	styleUrls: ['./movies-detail.component.css']
})
export class MoviesDetailComponent implements OnInit, OnDestroy {
	serverResponse: any;
	showContent: boolean = false;
	destroy$: Subject<boolean> = new Subject<boolean>();
	moviesPath = environment.moviesPath;

	constructor(private apiConn: GenericService, private noti: NotificacionService, private route: ActivatedRoute, private _sanitizer: DomSanitizer, private location: Location) {}

	ngOnInit(): void {
		let id = +this.route.snapshot.paramMap.get('id');
		this.route.params.subscribe((params) => {
			const id = +params['id'];
			this.getMovie(id);
		});
		this.showContent = false;
	}

	getMovie(id: any): void {
		this.apiConn
			.get('movies', id)
			.pipe(takeUntil(this.destroy$))
			.subscribe(
				(data: any) => {
					this.serverResponse = data;
					this.showContent = true;
				},
				(error: any) => {
					this.noti.msjValidacion(error);
				}
			);
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	viewTeaser(movie: any): void {
		Lity('https://www.youtube.com/embed/' + movie.teaser + '?autoplay=1');
	}

	viewTrailer(movie: any): void {
		Lity('https://www.youtube.com/embed/' + movie.trailer + '?autoplay=1');
	}

	goToLink(dest: string, movie: any): void {
		switch (dest) {
			case 'face':
				window.open('https://www.facebook.com/' + movie.facebook_id, '_blank');
				break;
			case 'inst':
				window.open('https://www.instagram.com/' + movie.instagram_id, '_blank');
				break;
			case 'twit':
				window.open('https://twitter.com/' + movie.twitter_id, '_blank');
				break;
			case 'page':
				window.open(movie.site, '_blank');
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

	backPage() {
		this.location.back();
	}
}
