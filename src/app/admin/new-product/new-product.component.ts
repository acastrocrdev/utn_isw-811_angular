import { Component, OnInit, NgModule, OnDestroy } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService } from 'src/app/share/notificacion.service';

@Component({
	selector: 'app-new-product',
	templateUrl: './new-product.component.html',
	styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit, OnDestroy {
	form: FormGroup;
	productId: any;
	serverResponseProducts: any;
	error: any;
	destroy$: Subject<boolean> = new Subject<boolean>();
	destroyClas$: Subject<boolean> = new Subject<boolean>();
	destroyTypes$: Subject<boolean> = new Subject<boolean>();

	// Select2
	public select2_clas: Array<Select2OptionData>;
	public options_clas: Options;
	public select2_typ: Array<Select2OptionData>;
	public options_typ: Options;
	public select2_est: Array<Select2OptionData>;
	public options_est: Options;

	// Img product
	imagePath_img_src: any;
	image_img_src: string | SafeUrl;
	messagePoster: string;
	haveImg: boolean;
	file_img_src: any;

	makeSubmit: boolean = false;

	constructor(
		private auth: AuthenticationService,
		private route: Router,
		private rout: ActivatedRoute,
		private sanitizer: DomSanitizer,
		private apiConn: GenericService,
		private noti: NotificacionService,
		public fb: FormBuilder,
		private httpClient: HttpClient
	) {
		this.reactiveForm_new();
		this.productId = +this.rout.snapshot.paramMap.get('id');
		this.getProductsTypes();
		this.getProductsClassifications();
		this.start_select2_estados();
	}

	async ngOnInit(): Promise<any> {
		if (this.productId) {
			await this.getProduct();
		} else {
			// ;
		}
		this.messagePoster = 'Subir fotografia';
		this.haveImg = false;
	}

	ngOnDestroy(): void {
		// this.destroy$.next(true);
		// this.destroy$.unsubscribe();
	}

	reactiveForm_new(): void {
		this.form = this.fb.group({
			id: ['0'],
			name: ['', [Validators.required]],
			description: ['', [Validators.required]],
			enable: ['', [Validators.required]],
			img_src: ['', [Validators.required]],
			img_src_url: ['', []],
			amount: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
			type_product_id: ['', [Validators.required]],
			classification_prod: ['', [Validators.required]]
		});
	}

	reactiveForm_edit(obj: any): void {
		console.log('reactiveForm_edit', obj);
		if (obj) {
			this.form = this.fb.group({
				id: [obj.id],
				name: [obj.name, [Validators.required]],
				description: [obj.description, [Validators.required]],
				enable: [obj.enable, [Validators.required]],
				img_src: [obj.img_src],
				img_src_url: ['', []],
				amount: [obj.amount, [Validators.required, Validators.pattern('^[0-9]*$')]],
				type_product_id: [obj.type_product_id, [Validators.required]],
				classification_prod: [obj.classification_prod, [Validators.required]]
			});
			this.image_img_src = this.sanitizer.bypassSecurityTrustUrl(environment.productPath + obj.img_src);
			this.messagePoster = 'Clic para cambiar el poster';
			this.haveImg = true;
		} else {
			this.reactiveForm_new();
		}
	}

	start_select2_cats(data: any): void {
		this.select2_clas = data;
		this.options_clas = {
			width: '300',
			multiple: true,
			tags: true
		};
	}

	start_select2_types(data: any): void {
		this.select2_typ = data;
		this.options_typ = {
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

	public toFormData<T>(formValue: T) {
		let formData = new FormData();
		for (const key of Object.keys(formValue)) {
			const value = formValue[key];
			formData.append(key, value);
		}
		return formData;
	}

	saveProduct(): any {
		this.makeSubmit = true;
		if (this.form.invalid) {
			return;
		}
		const formData = this.toFormData(this.form.value);
		if (this.productId) {
			this.apiConn.update_formdata('products', formData).subscribe(
				(respuesta: any) => {
					this.noti.mensaje('Éxito!!!', respuesta, 'success');
					this.route.navigate(['admin/productos-listado']);
				},
				(error) => {
					this.noti.msjValidacion(error);
				}
			);
		} else {
			this.apiConn.create_formdata('products', formData).subscribe(
				(respuesta: any) => {
					this.noti.mensaje('Éxito!!!', respuesta, 'success');
					this.route.navigate(['admin/productos-listado']);
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
		this.form.reset();
	}

	onBack() {
		this.route.navigate(['admin/productos-listado']);
	}

	updateImage_img_src(ev: any) {
		this.image_img_src = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(ev.target.files[0]));
		this.messagePoster = 'Clic para cambiar la fotografia';
		this.haveImg = true;
		const file = (ev.target as HTMLInputElement).files[0];
		this.form.patchValue({
			img_src: file
		});
		this.form.get('img_src').updateValueAndValidity();
	}

	async getProduct(): Promise<any> {
		await this.apiConn
			.get('products', this.productId)
			.pipe(takeUntil(this.destroy$))
			.subscribe(
				async (data: any) => {
					const prod = await this.adjustProduct(data);
					this.reactiveForm_edit(prod);
					return true;
				},
				(error: any) => {
					this.noti.msjValidacion(error);
				}
			);
	}

	async adjustProduct(products: any): Promise<any> {
		let newProdClas = [];
		products['classification_prod'].map((prod) => {
			newProdClas.push(prod['id']);
		});
		products['classification_prod'] = newProdClas;
		return products;
	}

	getProductsClassifications(): void {
		this.apiConn
			.list('products/select_classifications')
			.pipe(takeUntil(this.destroyClas$))
			.subscribe(
				(data: any) => {
					this.start_select2_cats(data);
				},
				(error: any) => {
					this.noti.msjValidacion(error);
				}
			);
	}

	getProductsTypes(): void {
		this.apiConn
			.list('types_products/select')
			.pipe(takeUntil(this.destroyTypes$))
			.subscribe(
				(data: any) => {
					this.start_select2_types(data);
				},
				(error: any) => {
					this.noti.msjValidacion(error);
				}
			);
	}

	public errorHandling = (control: string, error: string) => {
		return this.form.controls[control].hasError(error) && this.form.controls[control].invalid && (this.makeSubmit || this.form.controls[control].touched);
	};
}
