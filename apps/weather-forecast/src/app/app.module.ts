import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { WeatherForecastServicesModule } from '@bp/weather-forecast/services';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { WeatherMainComponent } from './weather-main/weather-main.component';

@NgModule({
	declarations: [AppComponent, WeatherMainComponent],
	imports: [BrowserModule, FormsModule, HttpClientModule, AppRoutingModule, WeatherForecastServicesModule],
	providers: [DatePipe],
	bootstrap: [AppComponent],
	exports: [],
})
export class AppModule {}
