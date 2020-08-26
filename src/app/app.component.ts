import { Component, OnInit, Renderer2, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import * as jquery from 'jquery';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
	title = 'autocineFe';
	constructor(public router: Router, private renderer: Renderer2) {}
	ngOnInit() {}

	ngAfterViewInit() {
		this.renderer.setStyle(this.renderer.selectRootElement('#loader'), 'display', 'none');
		// this.renderer.removeStyle(this.renderer.selectRootElement('app-inicio'), 'display');
		// // this.renderer.removeStyle(this.renderer.selectRootElement('app-outlet'), 'display');
		// this.renderer.removeStyle(this.renderer.selectRootElement('app-footer'), 'display');
	}
}
