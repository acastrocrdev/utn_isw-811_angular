import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductosRoutingModule } from './productos-routing.module';
import { ListaComponent } from './lista/lista.component';
import { DetalleComponent } from './detalle/detalle.component';
import { CompraComponent } from './compra/compra.component';
import { ProductsCardComponent } from './products-card/products-card.component';
import { ProductsComponent } from './products/products.component';
import { ShareModule } from './../share/share.module';
import { InicioComponent } from './inicio/inicio.component';

@NgModule({
	declarations: [ListaComponent, DetalleComponent, CompraComponent, ProductsCardComponent, ProductsComponent, InicioComponent],
	exports: [ProductsComponent],
	imports: [CommonModule, ProductosRoutingModule, ShareModule]
})
export class ProductosModule {}
