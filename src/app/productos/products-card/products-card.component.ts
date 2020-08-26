import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-products-card',
	templateUrl: './products-card.component.html',
	styleUrls: ['./products-card.component.css']
})
export class ProductsCardComponent implements OnInit {
	@Input() prod: any;

	img_src: string;
	img_path: string;

	constructor() {
		this.img_path = environment.productPath;
	}

	ngOnInit(): void {
		this.prod.modal = 'mymodal';
		this.img_src = `${this.img_path}${this.prod.img_src}`; // imagen
		// "type_product_id"
		// "created_at"
		// "updated_at"
	}

	viewProduct(prod: any): void {}
}
