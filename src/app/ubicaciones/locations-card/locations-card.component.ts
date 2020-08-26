import { Component, OnInit, Input } from '@angular/core';
import { SharedService } from './../../shared.service';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-locations-card',
	templateUrl: './locations-card.component.html',
	styleUrls: ['./locations-card.component.css']
})
export class LocationsCardComponent implements OnInit {
	@Input() loc: any;
	location_id: string;
	img_src: string;
	title: string;
	tags: string;
	detail: string;
	img_path: string;

	constructor() {
		this.img_path = environment.locationsPath;
	}

	ngOnInit(): void {
		this.loc.modal = 'mymodal';
		this.location_id = this.loc.id; // id Laravel
		this.img_src = `${this.img_path}${this.loc.img_src}`; // imagen
		this.title = this.loc.name; // Nombre
		this.tags = this.loc.resume; // resumen
		this.detail = this.loc.description; // details

		// "google_maps"
		// "waze"
		// "created_at"
		// "updated_at"
	}

	makeBooking(loc: string): void {}
}
