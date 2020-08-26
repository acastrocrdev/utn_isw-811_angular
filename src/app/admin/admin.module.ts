import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { CarteleraModule } from '../cartelera/cartelera.module';
import { InicioComponent } from './inicio/inicio.component';
import { NewMovieComponent } from './new-movie/new-movie.component';
import { ListMovieComponent } from './list-movie/list-movie.component';
import { NewUserComponent } from './new-user/new-user.component';
import { NewProductComponent } from './new-product/new-product.component';
import { ListProductsComponent } from './list-products/list-products.component';
import { ListLocationsComponent } from './list-locations/list-locations.component';
import { NewLocationComponent } from './new-location/new-location.component';
import { NgSelect2Module } from 'ng-select2';
import { DataTablesModule } from 'angular-datatables';
import { ListCarteleraComponent } from './list-cartelera/list-cartelera.component';
import { NewCarteleraComponent } from './new-cartelera/new-cartelera.component';

@NgModule({
	declarations: [
		InicioComponent,
		NewMovieComponent,
		ListMovieComponent,
		NewUserComponent,
		NewProductComponent,
		ListProductsComponent,
		ListLocationsComponent,
		NewLocationComponent,
		ListCarteleraComponent,
		NewCarteleraComponent
	],
	imports: [CarteleraModule, DataTablesModule, CommonModule, AdminRoutingModule, FormsModule, ReactiveFormsModule, NgSelect2Module],
	exports: [InicioComponent, NewMovieComponent, ListMovieComponent, NewUserComponent, NewProductComponent, ListProductsComponent, ListLocationsComponent, NewLocationComponent]
})
export class AdminModule {}
