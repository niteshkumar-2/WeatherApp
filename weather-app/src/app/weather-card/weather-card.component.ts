import { DatePipe, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../services/weather.service';

@Component({
  selector: 'app-weather-card',
  standalone: true,
  imports: [FormsModule, NgIf, DatePipe, NgStyle, NgFor],
  templateUrl: './weather-card.component.html',
  styleUrl: './weather-card.component.css',
})
export class WeatherCardComponent implements OnInit {
  city: string = '';
  allCitiesRes: any = [];
  selectedCountry: string = 'India';
  countries: string[] = ['India'];
  allCities: string[] = [];
  suggestions: string[] = [];
  weatherData: any = null;
  error: string = '';

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    this.getAllCities();
  }

  getAllCities() {
    this.weatherService.getSearchCity().subscribe(
      (response) => {
        this.allCitiesRes = response;
        this.countries = this.weatherService.getAllCountryNames(
          this.allCitiesRes
        );
        this.allCities = this.weatherService.filterCitiesOfIndia(
          this.allCitiesRes,
          'India'
        );
      },
      (error) => {
        this.error = 'Error fetching city suggestions.';
        this.allCities = [];
      }
    );
  }

  onCountryChange() {
    this.city = '';
    this.allCities = this.weatherService.filterCitiesOfIndia(
      this.allCitiesRes,
      this.selectedCountry
    );
  }

  getWeatherBackground() {
    if (this.weatherData) {
      const temp = this.weatherData.current.temp_c;

      if (temp <= 15) {
        return { background: 'linear-gradient(45deg, #00aaff, #4e8dff)' };
      } else if (temp <= 25) {
        return { background: 'linear-gradient(45deg, #ff9f00, #ff5f00)' };
      } else {
        return { background: 'linear-gradient(45deg, #ff7e5f, #ff3232)' };
      }
    }
    return {};
  }

  onCityInput(event: Event) {
    this.error = '';
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    if (query.length > 0) {
      this.suggestions = this.allCities.filter((city: string) =>
        city.toLowerCase().startsWith(query)
      );
    } else {
      this.suggestions = [];
    }
  }

  selectCity(city: string) {
    this.city = city;
    this.suggestions = [];
    this.getWeather();
  }

  getWeather() {
    if (!this.city.trim()) {
      this.error = 'Please enter a city name.';
      return;
    }

    this.weatherService.getWeatherByCity(this.city).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.error = '';
      },
      error: () => {
        this.weatherData = null;
        this.error = 'City not found or API error.';
      },
    });
  }
}
