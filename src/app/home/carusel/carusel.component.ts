import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-carusel',
	templateUrl: './carusel.component.html',
	styleUrls: ['./carusel.component.css']
})
export class CaruselComponent implements OnInit {
	img_path: string;

	constructor() {
		this.img_path = environment.carruselPath;
	}

	ngOnInit(): void {}
}
