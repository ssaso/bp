import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeatherMainComponent } from './weather-main/weather-main.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: '/weather',
		pathMatch: 'full',
		data: {},
		// Usually practice
		// loadChildren: () => import('../weather-module-folder/weather.module').then(m => m.WeatherModule),
	},
	{
		path: 'weather',
		component: WeatherMainComponent,
		// canActivate: [AuthGuard]
	},
	{ path: '**', redirectTo: 'weather' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { paramsInheritanceStrategy: 'always' })],
	exports: [RouterModule],
})
export class AppRoutingModule {}
