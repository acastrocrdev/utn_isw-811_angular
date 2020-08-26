import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';

const routes: Routes = [
	{ path: 'reservas', component: InicioComponent },
	{ path: 'reservas/lista', component: ListComponent },
	{ path: 'reservas/detalle/:id', component: DetailComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ReservasRoutingModule {}
