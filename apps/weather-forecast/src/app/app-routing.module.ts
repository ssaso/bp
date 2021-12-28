import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeatherMainComponent } from './weather-main/weather-main.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: '/weather',
		pathMatch: 'full',
		data: { city: 'Rome' },
	},
	{
		path: 'weather',
		component: WeatherMainComponent,
		// canActivate: [AuthGuard]
	},

	// {
	// 	path: '/weather',
	// 	component: Weather,
	// 	children: AuthGuardRoutes,
	// 	canActivate: [AuthGuard],
	// }
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { paramsInheritanceStrategy: 'always' })],
	exports: [RouterModule],
})
export class AppRoutingModule {}
