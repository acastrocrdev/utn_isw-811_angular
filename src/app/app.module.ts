import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { NgSelect2Module } from 'ng-select2';
import { DataTablesModule } from 'angular-datatables';
import { QRCodeModule } from 'angularx-qrcode';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { ShareModule } from './share/share.module';
import { HomeModule } from './home/home.module';
import { UserModule } from './user/user.module';
import { CarteleraModule } from './cartelera/cartelera.module';
import { ProductosModule } from './productos/productos.module';
import { ReservasModule } from './reservas/reservas.module';
import { UbicacionesModule } from './ubicaciones/ubicaciones.module';
import { CarritoModule } from './carrito/carrito.module';
import { AdminModule } from './admin/admin.module';
import { ConnInterceptorService } from './share/conn-interceptor.service';
import { environment } from 'src/environments/environment';

@NgModule({
	declarations: [AppComponent],
	imports: [
		AngularFireModule.initializeApp(environment.firebaseConfig),
		AngularFireAuthModule,
		QRCodeModule,

		DataTablesModule.forRoot(),
		BrowserModule,
		NgSelect2Module,
		FormsModule,

		// HttpClientModule: Comunicacion con el API por HTTP
		HttpClientModule,
		CoreModule,
		ShareModule,
		CarteleraModule,
		HomeModule,
		UserModule,
		ProductosModule,
		ReservasModule,
		UbicacionesModule,
		CarritoModule,
		AdminModule,
		// AppRoutingModule: Debe ir al final para que reconozca todas las rutas
		AppRoutingModule
	],
	exports: [],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: ConnInterceptorService,
			multi: true
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
