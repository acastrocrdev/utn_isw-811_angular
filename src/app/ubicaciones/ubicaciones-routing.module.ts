import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';

const routes: Routes = [
	{ path: 'ubicaciones', component: InicioComponent }
	// { path: 'home/about', component: AcercaDeComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class UbicacionesRoutingModule {}
