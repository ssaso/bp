import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';

import { WeatherForecastApiService } from '@bp/weather-forecast/services';
import { RecordDataModel } from 'libs/weather-forecast/services/src/lib/data-models/weatherDataModel';
import { headersConfig, modeOptionsConfig } from 'libs/weather-forecast/services/src/lib/data-models/configData';
import { CityDataModel } from 'libs/weather-forecast/services/src/lib/data-models/cityDataModel';

@Component({
	selector: 'bp-weather-main',
	templateUrl: './weather-main.component.html',
	styleUrls: ['./weather-main.component.scss'],
})
export class WeatherMainComponent implements OnInit {
	// Search input
	searchTerm = new Subject<any>();
	cities: CityDataModel[] = [];
	cityObj: Partial<CityDataModel> = {};
	cityName: string | null = null;

	// The Select
	modeOptions: string[] = modeOptionsConfig;
	mode: string = this.modeOptions[0];

	// table
	headers: string[] = headersConfig;
	tableRows: any[] = [];

	luckySearch = true;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private weatherForecastApiService: WeatherForecastApiService,
		private datePipe: DatePipe
	) {}

	ngOnInit(): void {
		this.route.queryParamMap
			.pipe(
				switchMap(params => {
					let modeFromUrl = params.get('mode')?.toLowerCase();
					if (modeFromUrl != null && this.modeOptions.indexOf(modeFromUrl) != -1) {
						this.mode = modeFromUrl;
					}
					this.cityName = params.get('city');
					return of(this.cityName);
				})
			)
			.subscribe(res => {
				if (res != null) {
					this.getWeatherData(res);
				}
			});

		this.searchTerm
			.pipe(
				map(e => (e.target as HTMLInputElement).value.trim().toUpperCase()),
				filter(text => text.length > 2),
				debounceTime(700),
				distinctUntilChanged()
			)
			.subscribe(searchVal => {
				this.luckySearch = false;
				this.getWeatherData(searchVal);
			});
	}

	ngOnDestroy(): void {
		this.searchTerm.unsubscribe();
	}

	getWeatherData(cityName: string) {
		if (cityName) {
			this.weatherForecastApiService.newCitySearch(cityName).subscribe({
				next: this.handleSearchCity.bind(this),
				error: () => {
					console.log('error: ', this);
				},
				// complete: () => {
				// 	console.log('complete', this);
				// },
			});
		}
	}

	handleSearchCity(data: CityDataModel[]) {
		if (data.length == 0) {
			window.alert('No city found');
			this.updateName('No name');
			this.tableRows.length = 0;
			return;
		}

		this.cities = data;
		this.cityObj = data[0];

		// Lucky search by 1st city from the list, happens only once if there's QueryParam city
		// remove for automatic search for the weather
		if (this.luckySearch) {
			this.searchWeather(this.cityObj);
		}
	}

	searchWeather(data: any) {
		if (data) {
			let cityName = data.name; // + ' - ' + data.country;
			let weatherService = this.weatherForecastApiService.getWeatherData(data.lat, data.lon, this.mode);
			if (this.mode === 'hourly') {
				weatherService.subscribe({
					next: (res: any) => {
						this.tableRows.length = 0;
						res.forEach((rec: any) => {
							rec.dt = this.datePipe.transform(rec.dt, 'hh:mm');
							if (rec.dt != this.tableRows[this.tableRows.length - 1]?.dt) {
								this.tableRows.push(rec);
							}
						});
					},
					error: this.handleError.bind(this),
				});
			} else if (this.mode === 'daily') {
				weatherService;
				weatherService.subscribe({
					next: (res: RecordDataModel[]) => {
						this.tableRows.length = 0;
						// Here also the data is not correct, so we will check and separate daily and get last 7 days
						// And ofcourse we can make better show of the temp and feels_like data
						res.forEach((rec: any) => {
							rec.dt = this.datePipe.transform(rec.dt, 'mediumDate');
							rec.temp = `day:${rec.temp.day} evening: ${rec.temp.eve}`;
							rec.feels_like = `day:${rec.feels_like.day} evening: ${rec.feels_like.eve}`;
						});
						this.tableRows = res;
					},
					error: this.handleError.bind(this),
				});
			}
			this.updateQuery(cityName, this.mode);
			this.updateName(cityName);
		}
	}

	changeMode(): void {
		this.searchWeather(this.cityObj);
	}

	updateQuery(cityName: string, modeName: string): void {
		this.router.navigate(['.'], { relativeTo: this.route, queryParams: { city: cityName, mode: modeName } });
	}

	updateName(cityName: string): void {
		this.headers[0] = cityName;
	}

	handleError(err: any): any {
		console.log('error: ', err?.error?.message);
		alert(err?.error?.message);
	}
}
