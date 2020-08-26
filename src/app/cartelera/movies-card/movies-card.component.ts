import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SharedService } from './../../shared.service';
import Lity from 'lity';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-movies-card',
	templateUrl: './movies-card.component.html',
	styleUrls: ['./movies-card.component.css']
})
export class MoviesCardComponent implements OnInit {
	@Input() movie: any;
	mov: any;
	show_btns: boolean;
	img_src: string;
	facebook: string;
	instagram: string;
	twitter: string;

	constructor(private sharedServiceMoviePreview: SharedService, private _sanitizer: DomSanitizer) {}

	ngOnInit(): void {
		this.show_btns = false;

		this.movie.modal = 'mymodal';
		this.img_src = environment.moviesPath + this.movie.img_src;
		// "external_code"
		// "classification_id"
		// "duration"
		// "production"
	}

	viewTeaser(movie: any): void {
		// this.getVideoIframe(this.movie.teaser);
		Lity('https://www.youtube.com/embed/' + this.movie.teaser + '?autoplay=1');
		// this.sharedServiceMoviePreview.runSubscriptionModalMoviePreview('teaser', this.movie);
	}

	viewTrailer(movie: any): void {
		// Lity(this.getVideoIframe(this.movie.trailer));
		Lity('https://www.youtube.com/embed/' + this.movie.trailer + '?autoplay=1');
		// this.sharedServiceMoviePreview.runSubscriptionModalMoviePreview('trailer', this.movie);
	}

	showBtns(): void {
		this.show_btns = true;
	}

	hiddenBtns(): void {
		this.show_btns = false;
	}

	goToLink(dest: string): void {
		switch (dest) {
			case 'face':
				window.open('https://www.facebook.com/' + this.movie.facebook_id, '_blank');
				break;
			case 'inst':
				window.open('https://www.instagram.com/' + this.movie.instagram_id, '_blank');
				break;
			case 'twit':
				window.open('https://twitter.com/' + this.movie.twitter_id, '_blank');
				break;
			case 'page':
				window.open(this.movie.site, '_blank');
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
}

// base_url http://image.tmdb.org/t/p/
// secure_base_url https://image.tmdb.org/t/p/
// Se agrega el tamño segun el tipo
// backdrop_sizes: w300 w780 w1280 original
// logo_sizes: w45 w92 w154 w185 w300 w500 original
// poster_sizes: w92 w154 w185 w342 w500 w780 original
// profile_sizes: w45 w185 h632 original
// still_sizes: w92 w185 w300 original
// Se agrega el nombre de la imagen
// Ejemplo:
// https://image.tmdb.org/t/p/original/tpFpsqbleCzEE2p5EgvUq6ozfCA.png
