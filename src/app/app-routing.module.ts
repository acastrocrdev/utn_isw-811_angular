import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';
import { CarteleraModule } from './cartelera/cartelera.module';

const routes: Routes = [
	{ path: '', redirectTo: '', pathMatch: 'full', runGuardsAndResolvers: 'always' },
	{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],

	exports: [RouterModule]
})
export class AppRoutingModule {}

// 1853179006
// CR80015201001039782062
