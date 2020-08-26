import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService } from 'src/app/share/notificacion.service';
import { environment } from 'src/environments/environment';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'app-new-cartelera',
	templateUrl: './new-cartelera.component.html',
	styleUrls: ['./new-cartelera.component.css']
})
export class NewCarteleraComponent implements OnInit, OnDestroy {
	form: FormGroup;
	billboardId: any;
	// serverResponseProducts: any;
	// error: any;
	destroy$: Subject<boolean> = new Subject<boolean>();
	destroyLoc$: Subject<boolean> = new Subject<boolean>();

	// destroyGen$: Subject<boolean> = new Subject<boolean>();

	// Select2
	public select2_loc: Array<Select2OptionData>;
	public options_loc: Options;
	public select2_mov: Array<Select2OptionData>;
	public options_mov: Options;
	public select2_vis: Array<Select2OptionData>;
	public options_vis: Options;
	public select2_est: Array<Select2OptionData>;
	public options_est: Options;

	makeSubmit: boolean = false;

	constructor(
		private auth: AuthenticationService,
		private route: Router,
		private rout: ActivatedRoute,
		private sanitizer: DomSanitizer,
		private apiConn: GenericService,
		private noti: NotificacionService,
		public fb: FormBuilder
	) {
		this.reactiveForm_new();
		this.billboardId = +this.rout.snapshot.paramMap.get('id');
		this.getLocations();
		this.getMovies();
		this.start_select2_visibilidad();
		this.start_select2_estados();
		// this.getMoviesGenres();

		this.start_select2_estados();
	}

	async ngOnInit(): Promise<any> {
		if (this.billboardId) {
			await this.getBillboard();
		} else {
			// ;
		}
	}

	ngOnDestroy(): void {
		// this.destroy$.next(true);
		// this.destroy$.unsubscribe();
	}

	reactiveForm_new(): void {
		this.form = this.fb.group({
			id: ['0'],
			movie_id: ['', [Validators.required]],
			location_id: ['', [Validators.required]],
			date: ['', [Validators.required]],
			time: ['', [Validators.required]],
			sales_enable: ['', [Validators.required]],
			visible: ['', [Validators.required]]
		});
	}

	reactiveForm_edit(obj: any): void {
		console.log('reactiveForm_edit', obj);
		if (obj) {
			this.form = this.fb.group({
				id: [obj.id],
				movie_id: [obj.movie_id, [Validators.required]],
				location_id: [obj.location_id, [Validators.required]],
				date: [obj.date, [Validators.required]],
				time: [obj.time, [Validators.required]],
				sales_enable: [obj.sales_enable, [Validators.required]],
				visible: [obj.visible, [Validators.required]]
			});
		} else {
			this.reactiveForm_new();
		}
	}

	getLocations(): void {
		this.apiConn
			.list('locations/select')
			.pipe(takeUntil(this.destroyLoc$))
			.subscribe(
				(data: any) => {
					this.start_select2_loc(data);
				},
				(error: any) => {
					this.noti.msjValidacion(error);
				}
			);
	}

	start_select2_loc(data: any): void {
		this.select2_loc = data;
		// this.value_clas = [];
		this.options_loc = {
			width: '300',
			multiple: false,
			tags: true
		};
	}

	getMovies(): void {
		this.apiConn
			.list('movies/select')
			.pipe(takeUntil(this.destroyLoc$))
			.subscribe(
				(data: any) => {
					this.start_select2_mov(data);
				},
				(error: any) => {
					this.noti.msjValidacion(error);
				}
			);
	}

	start_select2_mov(data: any): void {
		this.select2_mov = data;
		// this.value_clas = [];
		this.options_mov = {
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

	start_select2_visibilidad(): void {
		this.select2_vis = [
			{
				id: '1',
				text: 'Visible'
			},
			{
				id: '0',
				text: 'Oculto'
			}
		];
		this.options_vis = {
			width: '300',
			multiple: false,
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

	saveBillboard(): any {
		this.makeSubmit = true;
		if (this.form.invalid) {
			return;
		}
		const formData = this.toFormData(this.form.value);
		if (this.billboardId) {
			this.apiConn.update_formdata('billboards', formData).subscribe(
				(respuesta: any) => {
					this.noti.mensaje('Éxito!!!', respuesta, 'success');
					this.route.navigate(['admin/cartelera-listado']);
				},
				(error) => {
					this.noti.msjValidacion(error);
				}
			);
		} else {
			this.apiConn.create_formdata('billboards', formData).subscribe(
				(respuesta: any) => {
					this.noti.mensaje('Éxito!!!', respuesta, 'success');
					this.route.navigate(['admin/cartelera-listado']);
				},
				(error) => {
					this.noti.msjValidacion(error);
				}
			);
		}
	}

	onReset() {
		this.makeSubmit = false;
		this.form.reset();
	}

	onBack() {
		this.route.navigate(['admin/cartelera-listado']);
	}

	async getBillboard(): Promise<any> {
		await this.apiConn
			.get('billboards/edit', this.billboardId)
			.pipe(takeUntil(this.destroy$))
			.subscribe(
				async (data: any) => {
					this.reactiveForm_edit(data);
					return true;
				},
				(error: any) => {
					this.noti.msjValidacion(error);
				}
			);
	}

	// getMoviesGenres(): void {
	// 	this.apiConn
	// 		.list('genres/select')
	// 		.pipe(takeUntil(this.destroyGen$))
	// 		.subscribe(
	// 			(data: any) => {
	// 				this.start_select2_genres(data);
	// 			},
	// 			(error: any) => {
	// 				this.noti.msjValidacion(error);
	// 			}
	// 		);
	// }

	public errorHandling = (control: string, error: string) => {
		return this.form.controls[control].hasError(error) && this.form.controls[control].invalid && (this.makeSubmit || this.form.controls[control].touched);
	};
}
