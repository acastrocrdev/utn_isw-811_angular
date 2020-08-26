import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { MoviesDetailComponent } from './movies-detail/movies-detail.component';
import { BillboardCardComponent } from './billboard-card/billboard-card.component';

const routes: Routes = [
	// peliculas
	{ path: 'peliculas', component: InicioComponent },
	{ path: 'peliculas/:id', component: MoviesDetailComponent },

	// Cartelera
	{ path: 'cartelera/:id', component: BillboardCardComponent, pathMatch: 'full' }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CarteleraRoutingModule {}
