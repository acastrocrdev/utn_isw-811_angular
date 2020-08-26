import { Component, OnInit, NgModule, OnDestroy } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Subscription } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService } from 'src/app/share/notificacion.service';
import { SharedService } from 'src/app/shared.service';

@Component({
	selector: 'app-new-movie',
	templateUrl: './new-movie.component.html',
	styleUrls: ['./new-movie.component.css']
})
export class NewMovieComponent implements OnInit, OnDestroy {
	form: FormGroup;
	movieId: any;
	serverResponseProducts: any;
	error: any;
	destroy$: Subject<boolean> = new Subject<boolean>();
	destroyClas$: Subject<boolean> = new Subject<boolean>();
	destroyGen$: Subject<boolean> = new Subject<boolean>();
	modalMovieID$: Subscription;

	// Select2
	public select2_gen: Array<Select2OptionData>;
	public options_gen: Options;
	public select2_clas: Array<Select2OptionData>;
	public options_clas: Options;
	public select2_est: Array<Select2OptionData>;
	public options_est: Options;

	// Img poster
	imagePath_img_src: any;
	image_img_src: string | SafeUrl;
	messagePoster: string;
	haveImg: boolean;
	file_img_src: any;
	// Img banner
	imagePath_img_src_bg: any;
	image_img_src_bg: string | SafeUrl;
	messagePoster_bg: string;
	haveImg_bg: boolean;
	file_img_bg: any;

	classArr: any;
	GenArr: any;

	makeSubmit: boolean = false;

	constructor(
		private auth: AuthenticationService,
		private route: Router,
		private rout: ActivatedRoute,
		private sanitizer: DomSanitizer,
		private apiConn: GenericService,
		private noti: NotificacionService,
		public fb: FormBuilder,
		private httpClient: HttpClient,
		private sharedService: SharedService
	) {
		this.reactiveForm_new();
		this.movieId = +this.rout.snapshot.paramMap.get('id');
		this.getMoviesGenres();
		this.getMoviesClassifications();
		this.start_select2_estados();
	}

	ngOnInit(): void {
		this.modalMovieID$ = this.sharedService.suscribeModalMovieId().subscribe((obj: any) => {
			this.getMovieDetails(obj);
		});
		if (this.movieId) {
			this.getMovie();
		} else {
			// ;
		}
		this.messagePoster = 'Subir Poster';
		this.haveImg = false;
		this.messagePoster_bg = 'Subir Banner';
		this.haveImg_bg = false;
	}

	ngOnDestroy(): void {
		this.modalMovieID$.unsubscribe();
		// this.destroy$.next(true);
		// this.destroy$.unsubscribe();
	}

	reactiveForm_new(): void {
		this.form = this.fb.group({
			id: ['0'],
			name: ['', [Validators.required]],
			external_code: [''],
			resume: ['', []],
			synopsis: ['', [Validators.required]],
			img_src: ['', []],
			img_src_url: [''],
			img_src_bd: ['', []],
			img_src_bd_url: [''],
			site: [''],
			classification_id: ['', [Validators.required]],
			enable: ['', [Validators.required]],
			trailer: [''],
			teaser: [''],
			facebook_id: [''],
			twitter_id: [''],
			instagram_id: [''],
			duration: [''],
			production: [''],
			genres_list: ['', [Validators.required]]
		});
	}

	reactiveForm_edit(obj: any): void {
		console.log('reactiveForm_edit', obj);
		if (obj) {
			this.form = this.fb.group({
				id: [obj.id],
				name: [obj.name, [Validators.required]],
				external_code: [obj.external_code, []],
				resume: [obj.resume, []],
				synopsis: [obj.synopsis, [Validators.required]],
				img_src: ['', []],
				img_src_url: ['', []],
				img_src_bd: ['', []],
				img_src_bd_url: ['', []],
				site: [obj.site, []],
				classification_id: [obj.classification_id, [Validators.required]],
				enable: [obj.enable, [Validators.required]],
				trailer: [obj.trailer, []],
				teaser: [obj.teaser, []],
				facebook_id: [obj.facebook_id, []],
				twitter_id: [obj.twitter_id, []],
				instagram_id: [obj.instagram_id, []],
				duration: [obj.duration, []],
				production: [obj.production, []],
				genres_list: [obj.genres, [Validators.required]]
			});

			this.image_img_src = this.sanitizer.bypassSecurityTrustUrl(environment.moviesPath + obj.img_src);
			this.messagePoster = 'Clic para cambiar el poster';
			this.haveImg = true;
			this.image_img_src_bg = this.sanitizer.bypassSecurityTrustUrl(environment.moviesPath + obj.img_src_bd);
			this.messagePoster_bg = 'Clic para cambiar el banner';
			this.haveImg_bg = true;
		} else {
			this.reactiveForm_new();
		}
	}

	start_select2_clas(data: any): void {
		this.select2_clas = data;
		// this.value_clas = [];
		this.options_clas = {
			width: '300',
			multiple: false,
			tags: true
		};
	}

	start_select2_genres(data: any): void {
		this.select2_gen = data;
		// this.value_typ = '';
		this.options_gen = {
			width: '300',
			multiple: true,
			tags: true
		};
	}

	start_select2_estados(): void {
		this.select2_est = [
			{
				id: '1',
				text: 'Activo'
			},
			{
				id: '0',
				text: 'Inactivo'
			}
		];
		this.options_est = {
			width: '300',
			multiple: false,
			tags: true
		};
	}

	public toFormData<T>(formValue: T) {
		let formData = new FormData();
		for (const key of Object.keys(formValue)) {
			const value = formValue[key];
			formData.append(key, value);
		}
		return formData;
	}

	saveMovie(): any {
		this.makeSubmit = true;
		if (this.form.invalid) {
			return;
		}
		const formData = this.toFormData(this.form.value);
		if (this.movieId) {
			this.apiConn.update_formdata('movies', formData).subscribe(
				(respuesta: any) => {
					this.noti.mensaje('Éxito!!!', respuesta, 'success');
					this.route.navigate(['admin/peliculas-listado']);
				},
				(error) => {
					this.noti.msjValidacion(error);
				}
			);
		} else {
			this.apiConn.create_formdata('movies', formData).subscribe(
				(respuesta: any) => {
					this.noti.mensaje('Éxito!!!', respuesta, 'success');
					this.route.navigate(['admin/peliculas-listado']);
				},
				(error) => {
					this.noti.msjValidacion(error);
				}
			);
		}
	}
	onReset() {
		this.makeSubmit = false;
		this.image_img_src = '';
		this.messagePoster = 'Subir Poster';
		this.image_img_src_bg = '';
		this.messagePoster_bg = 'Subir Banner';
		this.form.reset();
	}

	onBack() {
		this.route.navigate(['admin/peliculas-listado']);
	}

	updateImage_img_src(ev: any) {
		this.image_img_src = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(ev.target.files[0]));
		this.messagePoster = 'Clic para cambiar el poster';
		this.haveImg = true;
		const file = (ev.target as HTMLInputElement).files[0];
		this.form.patchValue({
			img_src: file
		});
		this.form.get('img_src').updateValueAndValidity();
	}

	updateImage_img_src_bg(ev: any) {
		this.image_img_src_bg = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(ev.target.files[0]));
		this.messagePoster_bg = 'Clic para cambiar el banner';
		this.haveImg_bg = true;
		const file = (ev.target as HTMLInputElement).files[0];
		this.form.patchValue({
			img_src_bd: file
		});
		this.form.get('img_src_bd').updateValueAndValidity();
	}

	async getMovie(): Promise<any> {
		await this.apiConn
			.get('movies', this.movieId)
			.pipe(takeUntil(this.destroy$))
			.subscribe(
				async (data: any) => {
					const mov = await this.adjustMovie(data);
					this.reactiveForm_edit(mov);
					return true;
				},
				(error: any) => {
					this.noti.msjValidacion(error);
				}
			);
	}

	async adjustMovie(movies: any): Promise<any> {
		let newMovGen = [];
		movies['genres'].map((mov) => {
			newMovGen.push(mov['id']);
		});
		movies['genres'] = newMovGen;
		return movies;
	}

	getMoviesClassifications(): void {
		this.apiConn
			.list('classifications/select')
			.pipe(takeUntil(this.destroyClas$))
			.subscribe(
				(data: any) => {
					this.classArr = data;
					this.start_select2_clas(data);
				},
				(error: any) => {
					this.noti.msjValidacion(error);
				}
			);
	}

	getMoviesGenres(): void {
		this.apiConn
			.list('genres/select')
			.pipe(takeUntil(this.destroyGen$))
			.subscribe(
				(data: any) => {
					this.GenArr = data;
					this.start_select2_genres(data);
				},
				(error: any) => {
					this.noti.msjValidacion(error);
				}
			);
	}

	public errorHandling = (control: string, error: string) => {
		return this.form.controls[control].hasError(error) && this.form.controls[control].invalid && (this.makeSubmit || this.form.controls[control].touched);
	};

	emptyName(): boolean {
		return this.form.controls['name'].hasError('required') && this.form.controls['name'].invalid;
	}

	findMovies(): void {
		this.sharedService.runSubscriptionModalMoviePreview('find_movie', { name: this.form.get('name').value });
	}

	getMovieDetails(idMovie: any): void {
		this.getMovieData(idMovie);
		this.getMovieRS(idMovie);
		this.getMovieVideos(idMovie);
		this.getMovieCert(idMovie);
	}

	getMovieData(idMovie: any): void {
		this.apiConn
			.getMovieInfo('movies_data', idMovie)
			.pipe(takeUntil(this.destroy$))
			.subscribe(
				(data: any) => {
					this.form.controls['name'].setValue(data.title);
					this.form.controls['external_code'].setValue(data.id);
					this.form.controls['resume'].setValue(data.tagline);
					this.form.controls['synopsis'].setValue(data.overview);
					// this.form.controls['img_src'].setValue();
					// this.form.controls['img_src_bd'].setValue();
					this.form.controls['img_src_url'].setValue(environment.imagesMoviesDB + 'original' + data.poster_path);
					this.form.controls['img_src_bd_url'].setValue(environment.imagesMoviesDB + 'original' + data.backdrop_path);
					this.form.controls['site'].setValue(data.homepage);
					this.form.controls['duration'].setValue(data.runtime);
					this.form.controls['production'].setValue('');
					this.image_img_src = this.sanitizer.bypassSecurityTrustUrl(environment.imagesMoviesDB + 'w500' + data.poster_path);
					this.messagePoster = 'Clic para cambiar el poster';
					this.haveImg = true;
					this.image_img_src_bg = this.sanitizer.bypassSecurityTrustUrl(environment.imagesMoviesDB + 'w500' + data.backdrop_path);
					this.messagePoster_bg = 'Clic para cambiar el banner';
					this.haveImg_bg = true;
					let arrGen = [];
					data.genres.map((obj_res) => {
						let res = this.GenArr.filter((obj_gen) => obj_res.id == obj_gen.external_code);
						if (typeof res != 'undefined') {
							arrGen.push(res[0].id);
						}
					});
					this.form.controls['genres_list'].setValue(arrGen);
				},
				(error: any) => {
					console.log('getMovieData error: ', error);
					this.noti.msjValidacion(error);
				}
			);
	}

	getMovieRS(idMovie: any): void {
		this.apiConn
			.getMovieInfo('movies_rs', idMovie)
			.pipe(takeUntil(this.destroy$))
			.subscribe(
				(data: any) => {
					this.form.controls['facebook_id'].setValue(data.facebook_id);
					this.form.controls['twitter_id'].setValue(data.twitter_id);
					this.form.controls['instagram_id'].setValue(data.instagram_id);
				},
				(error: any) => {
					console.log('getMovieData error: ', error);
					this.noti.msjValidacion(error);
				}
			);
	}

	getMovieVideos(idMovie: any): void {
		this.apiConn
			.getMovieInfo('movies_video', idMovie)
			.pipe(takeUntil(this.destroy$))
			.subscribe(
				(data: any) => {
					console.log('getMovieVideos', data);
					this.form.controls['trailer'].setValue('');
					this.form.controls['teaser'].setValue('');
					data.results.map((obj) => {
						if (obj.site == 'YouTube') {
							if (obj.type == 'Trailer') {
								this.form.controls['trailer'].setValue(obj.key);
							} else if (obj.type == 'Teaser') {
								this.form.controls['teaser'].setValue(obj.key);
							}
						}
					});
				},
				(error: any) => {
					console.log('getMovieData error: ', error);
					this.noti.msjValidacion(error);
				}
			);
	}

	getMovieCert(idMovie: any): void {
		this.apiConn
			.getMovieInfo('movies_cert', idMovie)
			.pipe(takeUntil(this.destroy$))
			.subscribe(
				(data: any) => {
					const res = data.results.filter((obj) => obj.iso_3166_1 == 'US');
					if (res.length == 0) {
						this.form.controls['classification_id'].setValue('5');
					} else {
						let cert = res[0].release_dates[0].certification;
						let cla = this.classArr.filter((obj) => {
							return obj.code == cert;
						});
						if (cla.length == 0) {
							this.form.controls['classification_id'].setValue('5');
						} else {
							this.form.controls['classification_id'].setValue(cla[0].id);
						}
					}
				},
				(error: any) => {
					console.log('getMovieData error: ', error);
					this.noti.msjValidacion(error);
				}
			);
	}
}
