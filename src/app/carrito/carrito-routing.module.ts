import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from '../reservas/inicio/inicio.component';

const routes: Routes = [
	{ path: 'carrito', component: InicioComponent }
	// { path: 'home/about', component: AcercaDeComponent }];
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CarritoRoutingModule {}
