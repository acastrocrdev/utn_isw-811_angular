import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { AcercaDeComponent } from './acerca-de/acerca-de.component';
import { CaruselComponent } from './carusel/carusel.component';
import { LocationsComponent } from './locations/locations.component';
import { CarteleraModule } from './../cartelera/cartelera.module';
import { ShareModule } from './../share/share.module';
import { InicioComponent } from './inicio/inicio.component';
import { UbicacionesModule } from '../ubicaciones/ubicaciones.module';
import { ProductosModule } from '../productos/productos.module';

@NgModule({
	declarations: [InicioComponent, AcercaDeComponent, CaruselComponent, LocationsComponent],
	imports: [CommonModule, HomeRoutingModule, ShareModule, CarteleraModule, UbicacionesModule, ProductosModule],

	exports: [InicioComponent]
})
export class HomeModule {}
