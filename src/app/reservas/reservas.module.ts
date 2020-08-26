import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { ReservasRoutingModule } from './reservas-routing.module';
import { InicioComponent } from './inicio/inicio.component';
import { ShareModule } from '../share/share.module';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
	declarations: [InicioComponent, ListComponent, DetailComponent],
	imports: [DataTablesModule, CommonModule, ShareModule, ReservasRoutingModule, FormsModule, ReactiveFormsModule, QRCodeModule]
})
export class ReservasModule {}
