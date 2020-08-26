import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewMovieComponent } from './new-movie/new-movie.component';
import { ListMovieComponent } from './list-movie/list-movie.component';
import { NewProductComponent } from './new-product/new-product.component';
import { ListProductsComponent } from './list-products/list-products.component';
import { NewLocationComponent } from './new-location/new-location.component';
import { ListLocationsComponent } from './list-locations/list-locations.component';
import { AuthGuardService } from '../share/auth-guard.service';
import { RoleGuardService } from '../share/role-guard.service';
import { InicioComponent } from './inicio/inicio.component';
import { LoginGuardService } from '../share/login-guard.service';
import { ListCarteleraComponent } from './list-cartelera/list-cartelera.component';
import { NewCarteleraComponent } from './new-cartelera/new-cartelera.component';

const routes: Routes = [
	// index
	{ path: 'admin/', component: InicioComponent, canActivate: [AuthGuardService, LoginGuardService, RoleGuardService], data: { requireRole: '2' } },
	// Peliculas
	{ path: 'admin/peliculas-listado', component: ListMovieComponent, canActivate: [AuthGuardService, RoleGuardService], data: { requireRole: '2' } },
	{ path: 'admin/peliculas-nuevo', component: NewMovieComponent, canActivate: [AuthGuardService, RoleGuardService], data: { requireRole: '2' } },
	{ path: 'admin/peliculas-editar/:id', component: NewMovieComponent, canActivate: [AuthGuardService, RoleGuardService], data: { requireRole: '1' } },
	// productos
	{ path: 'admin/productos-listado', component: ListProductsComponent, canActivate: [AuthGuardService, RoleGuardService], data: { requireRole: '2' } },
	{ path: 'admin/productos-nuevo', component: NewProductComponent, canActivate: [AuthGuardService, RoleGuardService], data: { requireRole: '2' } },
	{ path: 'admin/productos-editar/:id', component: NewProductComponent, canActivate: [AuthGuardService, RoleGuardService], data: { requireRole: '1' } },
	// cartelera
	{ path: 'admin/cartelera-listado', component: ListCarteleraComponent, canActivate: [AuthGuardService, RoleGuardService], data: { requireRole: '2' } },
	{ path: 'admin/cartelera-nuevo', component: NewCarteleraComponent, canActivate: [AuthGuardService, RoleGuardService], data: { requireRole: '2' } },
	{ path: 'admin/cartelera-editar/:id', component: NewCarteleraComponent, canActivate: [AuthGuardService, RoleGuardService], data: { requireRole: '1' } },
	// Ubicaciones
	{ path: 'admin/ubicaciones-listado', component: ListLocationsComponent, canActivate: [AuthGuardService, RoleGuardService], data: { requireRole: '2' } },
	{ path: 'admin/ubicaciones-nuevo', component: NewLocationComponent, canActivate: [AuthGuardService, RoleGuardService], data: { requireRole: '2' } },
	{ path: 'admin/ubicaciones-editar/:id', component: NewLocationComponent, canActivate: [AuthGuardService, RoleGuardService], data: { requireRole: '1' } }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],

	exports: [RouterModule]
})
export class AdminRoutingModule {}
