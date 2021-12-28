export interface WeatherDataModel {
	hourly?: RecordDataModel;
	daily?: RecordDataModel;
	lat: string;
	lon: number;
	timezone: string;
	timezone_offset: number;
}

export interface RecordDataModel {
	clouds: number;
	dew_point: number;
	dt: Date;
	feels_like: tempDataModel | number;
	humidity: number;
	moon_phase: number;
	moonrise: Date;
	moonset: Date;
	pop: number;
	pressure: number;
	rain: number;
	sunrise: Date;
	sunset: Date;
	temp: tempDataModel | number;
	uvi: 1.4;
	// Not needed
	// weather: any[];
	wind_deg: number;
	wind_gust: number;
	wind_speed: number;
}

interface tempDataModel {
	day: number;
	min: number;
	max: number;
	night: number;
	eve: number;
	morn: number;
}


