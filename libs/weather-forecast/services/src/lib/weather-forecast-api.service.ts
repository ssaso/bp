import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { map } from 'rxjs/internal/operators/map';
import { RecordDataModel, WeatherDataModel } from './data-models/weatherDataModel';
import { CityDataModel } from './data-models/cityDataModel';

const cityLimit = 10;
const excludeAll = 'current,minutely,hourly,daily,alerts';

// In a normal scenario I would add this from an enviroment file. #1
// import { openWeatherBaseUrl } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class WeatherForecastApiService {
	// TODO: #1
	// openWeatherUrl: string = environment.openWeatherUrl;
	private openWeatherBaseUrl = 'https://api.openweathermap.org';
	private _apiKey = '010721642521f31b0fbc8c3831d45951';
	// END: #1

	// TODO: Separate this in a different services one for City one for Weather data
	private openWeatherGeoUrl = `${this.openWeatherBaseUrl}/geo/1.0/direct`;
	private openWeatherDataUrl = `${this.openWeatherBaseUrl}/data/2.5/onecall`;

	constructor(private httpClient: HttpClient) {}

	newCitySearch(cityName: string): Observable<CityDataModel[] | any> {
		return this.httpClient
			.get<CityDataModel[]>(`${this.openWeatherGeoUrl}?q=${cityName}&limit=${cityLimit}&appid=${this._apiKey}`)
			.pipe(distinctUntilChanged());
	}

	getWeatherData(lat: number, lon: number, mode: string): Observable<RecordDataModel[] | any> {
		let exclude = excludeAll.replace(`${mode},`, '');
		return this.httpClient
			.get<WeatherDataModel>(
				`${this.openWeatherDataUrl}?lat=${lat}&lon=${lon}&exclude=${exclude}&appid=${this._apiKey}`
			)
			.pipe(
				map(responseData => {
					// return responseData[mode]; // Dynamic approach
					return mode === 'hourly' ? responseData.hourly : responseData.daily;
				})
			);
	}
}
