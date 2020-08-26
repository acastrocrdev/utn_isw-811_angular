import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarteleraRoutingModule } from './cartelera-routing.module';
import { MoviesComponent } from './movies/movies.component';
import { MoviesDetailComponent } from './movies-detail/movies-detail.component';
import { ShareModule } from './../share/share.module';
import { MoviesCardComponent } from './movies-card/movies-card.component';
import { MoviesPreviewComponent } from './movies-preview/movies-preview.component';
import { BillboardCardComponent } from './billboard-card/billboard-card.component';
import { BillboardComponent } from './billboard/billboard.component';
import { InicioComponent } from './inicio/inicio.component';
import { NgSelect2Module } from 'ng-select2';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
	declarations: [MoviesPreviewComponent, MoviesComponent, MoviesDetailComponent, MoviesCardComponent, BillboardCardComponent, BillboardComponent, InicioComponent],
	exports: [MoviesPreviewComponent, MoviesComponent, BillboardComponent],
	imports: [CommonModule, CarteleraRoutingModule, ShareModule, NgSelect2Module, DataTablesModule]
})
export class CarteleraModule {}
