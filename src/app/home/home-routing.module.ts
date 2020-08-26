import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { AcercaDeComponent } from './acerca-de/acerca-de.component';

const routes: Routes = [
	{ path: 'home', component: InicioComponent },
	{ path: 'home/about', component: AcercaDeComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],

	exports: [RouterModule]
})
export class HomeRoutingModule {}
