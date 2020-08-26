import { Component, OnInit, ViewChild, TemplateRef, OnDestroy, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SharedService } from './../../shared.service';
import { Subscription, Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericService } from 'src/app/share/generic.service';
import { takeUntil } from 'rxjs/operators';
import { NotificacionService } from 'src/app/share/notificacion.service';
import { DataTableDirective } from 'angular-datatables';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-movies-preview',
	templateUrl: './movies-preview.component.html',
	styleUrls: ['./movies-preview.component.css']
})
export class MoviesPreviewComponent implements OnInit, OnDestroy {
	@ViewChild('content_modal', { read: TemplateRef }) tpl: TemplateRef<any>;
	modalMoviePreview$: Subscription;
	destroy$: Subject<boolean> = new Subject<boolean>();
	closeResult: string;
	modal_title: string;
	current_url: SafeUrl;
	showModal: boolean;
	haveMovies: boolean = false;
	is_movies: boolean = false;

	@ViewChild(DataTableDirective, { static: false })
	dtOptions: DataTables.Settings = {};
	dtTrigger$: Subject<any> = new Subject();
	dtElement: DataTableDirective;
	moviesList: any;
	imagesMoviesDB: String = environment.imagesMoviesDB;

	listenActions: any;

	constructor(
		private noti: NotificacionService,
		private apiConn: GenericService,
		private sharedService: SharedService,
		private modalService: NgbModal,
		private _sanitizer: DomSanitizer,
		private renderer: Renderer2
	) {
		this.startDT();
		this.modalMoviePreview$ = this.sharedService.suscribeModalMoviePreview().subscribe((obj: any) => {
			this.open(obj);
		});
	}

	ngOnInit(): void {
		this.dtTrigger$.next();
	}

	ngOnDestroy(): void {
		this.listenActions();
		// this.modalMoviePreview$.unsubscribe();
	}

	ngAfterViewInit(): void {
		this.listenActions = this.renderer.listen('document', 'click', (event) => {
			if (event.target.hasAttribute('edit-element-id')) {
				this.setMovieId(event.target.getAttribute('edit-element-id'));
			}
		});
	}

	startDT(): void {
		this.dtOptions = {
			pagingType: 'full_numbers',
			lengthChange: true,
			pageLength: 10,
			processing: false,
			autoWidth: true,
			scrollY: '200px',
			responsive: true,
			order: [2, 'asc'],
			columns: [
				{
					title: 'Imagen',
					data: 'location'
				},
				{
					title: 'Nombre',
					data: 'name'
				},
				{
					title: 'Sipnosis',
					data: 'date'
				},
				{
					title: 'Seleccionar',
					data: 'time',
					orderable: false,
					render: (data, type, full) => {
						return;
					}
				}
			]
		};
	}

	open(obj: any) {
		this.modalService.dismissAll();
		this.modalService.open(this.tpl, { windowClass: 'movies_preview', size: 'lg' });
		this.is_movies = false;
		this.haveMovies = false;
		this.modal_title = obj.title;
		if (obj.vari == 'teaser') {
			this.getVideoIframe(obj.teaser);
		} else if (obj.vari == 'trailer') {
			this.getVideoIframe(obj.trailer);
		} else if (obj.vari == 'find_movie') {
			// this.dtElement.dtOptions.
			this.is_movies = true;
			this.haveMovies = true;

			this.findMovies(obj);
		}
	}

	getVideoIframe(url: string) {
		let results: any;
		if (url === null) {
			return '';
		}
		results = url.match('[\\?&]v=([^&#]*)');
		let video = results === null ? url : results[1];
		this.current_url = this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video + '?autoplay=1');
	}

	setMovieId(mov: any): void {
		this.sharedService.runSubscriptionModalMovieId(mov);
		this.modalService.dismissAll('option select');
	}

	findMovies(movie: any): void {
		this.modal_title = 'Resultado de consulta';
		this.apiConn
			.getMovieInfo('movies_list', movie.name)
			.pipe(takeUntil(this.dtTrigger$))
			.subscribe(
				(data: any) => {
					if (data.total_results == 0) {
						this.haveMovies = false;
					} else {
						this.haveMovies = true;
						this.moviesList = data.results;
						this.dtTrigger$.next();
					}
				},
				(error: any) => {
					console.log('findMovies error: ', error);
					this.noti.msjValidacion(error);
					this.dtTrigger$.next([]);
				}
			);
	}
}
