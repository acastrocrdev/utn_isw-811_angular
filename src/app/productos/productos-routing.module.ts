import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { DetalleComponent } from './detalle/detalle.component';

const routes: Routes = [
	{ path: 'productos', component: InicioComponent },
	{ path: 'productos/:id', component: DetalleComponent }
	// { path: 'home/about', component: AcercaDeComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ProductosRoutingModule {}
