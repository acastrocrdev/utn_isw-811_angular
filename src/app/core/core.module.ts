import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegistroComponent } from './registro/registro.component';

import { ToastrModule } from 'ngx-toastr';

@NgModule({
	declarations: [HeaderComponent, FooterComponent, PageNotFoundComponent, LoginComponent, RegistroComponent],
	imports: [CommonModule, RouterModule, BrowserAnimationsModule, ToastrModule.forRoot({ maxOpened: 1, autoDismiss: true, enableHtml: true }), FormsModule, ReactiveFormsModule],
	exports: [HeaderComponent, FooterComponent, LoginComponent, RegistroComponent]
})
export class CoreModule {}
