import requests
import os

class ExternalInfoService:
    """
    Service to fetch Weather and Global News data.
    - Weather: OpenWeatherMap (Forecast)
    - News: NewsAPI (Medical, Geopolitical, Climatic)
    """
    def __init__(self):
        self.weather_key = os.getenv('OPENWEATHER_API_KEY', 'placeholder_weather_key')
        self.news_key = os.getenv('NEWS_API_KEY', 'placeholder_news_key')

    def get_weather_forecast(self, city="Nairobi"):
        """Fetch 5-day weather forecast."""
        # Using a public free API endpoint for demo if key is missing
        if self.weather_key == 'placeholder_weather_key':
            return {
                "city": city,
                "forecast": [
                    {"day": "Today", "temp": 24, "condition": "Sunny", "icon": "☀️"},
                    {"day": "Tomorrow", "temp": 22, "condition": "Cloudy", "icon": "☁️"},
                    {"day": "Friday", "temp": 21, "condition": "Rain", "icon": "🌧️"}
                ]
            }
        
        url = f"https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={self.weather_key}&units=metric"
        try:
            res = requests.get(url)
            return res.json()
        except Exception as e:
            return {"error": str(e)}

    def get_community_news(self, categories=["medical", "geopolitical", "climate"]):
        """Fetch relevant global news based on specific keywords."""
        if self.news_key == 'placeholder_news_key':
            return {
                "articles": [
                    {
                        "title": "Global Health Update: New Malaria Vaccine Rollout",
                        "category": "Medical",
                        "source": "Health Monitor",
                        "url": "#"
                    },
                    {
                        "title": "East Africa Geopolitical Summit 2026",
                        "category": "Geopolitical",
                        "source": "Nairobi Post",
                        "url": "#"
                    },
                    {
                        "title": "Climate Change: Unusual Rain Patterns in Kenya",
                        "category": "Climatic",
                        "source": "EcoDaily",
                        "url": "#"
                    }
                ]
            }

        query = " OR ".join(categories)
        url = f"https://newsapi.org/v2/everything?q={query}&apiKey={self.news_key}&pageSize=5"
        try:
            res = requests.get(url)
            return res.json()
        except Exception as e:
            return {"error": str(e)}
