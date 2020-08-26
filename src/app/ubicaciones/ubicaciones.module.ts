import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UbicacionesRoutingModule } from './ubicaciones-routing.module';
import { ListaComponent } from './lista/lista.component';
import { DetalleComponent } from './detalle/detalle.component';
import { LocationsCardComponent } from './locations-card/locations-card.component';
import { InicioComponent } from './inicio/inicio.component';

@NgModule({
	declarations: [ListaComponent, DetalleComponent, LocationsCardComponent, InicioComponent],
	exports: [LocationsCardComponent],
	imports: [CommonModule, UbicacionesRoutingModule]
})
export class UbicacionesModule {}
