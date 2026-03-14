import os
import requests
from flask import current_app

class WeatherService:
    def __init__(self):
        # Ensure you add OPENWEATHER_API_KEY to your .env or config
        self.api_key = current_app.config.get('OPENWEATHER_API_KEY')
        self.base_url = "https://api.openweathermap.org/data/2.5/weather"

    def get_weather_by_coords(self, lat, lon):
        """Fetches current weather data for specific farm coordinates."""
        if not self.api_key:
            return {"error": "API Key missing"}, 500

        params = {
            'lat': lat,
            'lon': lon,
            'appid': self.api_key,
            'units': 'metric'  # Use 'imperial' for Fahrenheit
        }

        try:
            response = requests.get(self.base_url, params=params)
            response.raise_for_status() # Raises error for 4xx or 5xx responses
            data = response.json()

            # Simplify the response for our AI models
            return {
                "temp": data['main']['temp'],
                "humidity": data['main']['humidity'],
                "description": data['weather'][0]['description'],
                "wind_speed": data['wind']['speed'],
                "rain": data.get('rain', {}).get('1h', 0) # Rainfall in last hour
            }
        except requests.exceptions.RequestException as e:
            return {"error": str(e)}, 500

weather_service = WeatherService()