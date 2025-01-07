import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  
  constructor(private http: HttpClient) {}

  // http://api.weatherapi.com/v1/current.json?key=accaada3db46493ab9a180550242812&q=Patna&aqi=no

  getWeatherByCity(city :string): Observable<any> {
    // &exclude=${'hourly,daily'}
    const url = `${environment.baseWeatherUrl}/current.json?key=${environment.apiKey}&q=${city}&aqi=no`;
    return this.http.get(url);
  }

  getSearchCityAll(city: string): Observable<any> {
    // &exclude=${'hourly,daily'}
    const url = `${environment.baseWeatherUrl}/search.json?key=${environment.apiKey}&q=${city}`;
    return this.http.get(url);
  }

  getSearchCity(): Observable<any> {
    // &exclude=${'hourly,daily'}
    const url = `${environment.countriesCitiesApiUrl}`;
    return this.http.get(url);
  }

  // Function to filter out cities of India from the response
  filterCitiesOfIndia(data: any, search:string): string[] {
    const indiaData = data.data.find((country: any) => country.country === search);
    return indiaData ? indiaData.cities : [];
  }

  getAllCountryNames(res: any) {
    return res.data.map((data:any) => data.country);
  }
}
