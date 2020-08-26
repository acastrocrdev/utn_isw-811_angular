import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import Lity from 'lity';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService } from 'src/app/share/notificacion.service';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { SharedService } from 'src/app/shared.service';

@Component({
	selector: 'app-billboard-card',
	templateUrl: './billboard-card.component.html',
	styleUrls: ['./billboard-card.component.css']
})
export class BillboardCardComponent implements OnInit {
	currentUser: any;
	location: any;
	billboard: any;
	movies: any;
	classification: any;
	error: any;
	showContent: boolean = false;
	show_btns: boolean;
	destroy$: Subject<boolean> = new Subject<boolean>();
	moviesPath = environment.moviesPath;
	locationsPath = environment.locationsPath;

	public select2_tic: Array<Select2OptionData>;
	public options_tic: Options;

	constructor(
		private sharedServiceLogin: SharedService,
		private apiConn: GenericService,
		private noti: NotificacionService,
		private route: ActivatedRoute,
		private router: Router,
		private _sanitizer: DomSanitizer,
		private auth: AuthenticationService
	) {
		this.auth.currentUser.subscribe((user) => {
			this.currentUser = user;
		});
	}

	ngOnInit(): void {
		let id = +this.route.snapshot.paramMap.get('id');
		this.route.params.subscribe((params) => {
			const id = +params['id'];
			this.getlocations(id);
		});
		this.showContent = false;
		this.show_btns = false;
	}

	getlocations(id: any): void {
		this.apiConn
			.get('billboards/locations', id)
			.pipe(takeUntil(this.destroy$))
			.subscribe(
				(data: any) => {
					this.location = data[0];
					this.billboard = data.billboard;
					this.movies = data.movies;
					this.classification = data.classification;
					this.showContent = true;
					this.start_select2_tickets(data.ticket);
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

	showLogin(id: string): void {
		this.auth.tmpPass = {
			action: 'next_page',
			page: '/cartelera/' + id
		};
		this.sharedServiceLogin.runSubscriptionModalLogin();
		// login_modal
	}

	getID(id: any, id_2: any): string {
		return 'select_ext_' + id + '_' + id_2;
	}

	goToLinkLocation(dest: string, loc: any): void {
		switch (dest) {
			case 'waze':
				window.open('https://waze.com/ul?ll=' + loc.waze + '&navigate=yes&zoom=17', '_blank');
				break;
			case 'gmaps':
				window.open('https://goo.gl/maps/' + loc.google_maps, '_blank');
				break;
		}
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

	getVideoIframe(url: string) {
		let results: any;
		if (url === null) {
			return '';
		}
		results = url.match('[\\?&]v=([^&#]*)');
		let video = results === null ? url : results[1];
		return this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video + '?autoplay=1');
	}

	agregarCarrito(id: any): void {}

	start_select2_tickets(tic: any): void {
		this.select2_tic = tic;
		this.options_tic = {
			width: '300',
			multiple: false,
			tags: true
		};
	}

	gotoCartelera(id_bill: any, id_loc: any, id_mov: any): void {
		this.router.navigate(['/reservas'], { queryParams: { bill: id_bill, movie: id_mov, loc: id_loc } });
	}

	// public errorHandling = (control: string, error: string) => {
	// 	return this.form.controls[control].hasError(error) && this.form.controls[control].invalid && (this.makeSubmit || this.form.controls[control].touched);
	// };
}
