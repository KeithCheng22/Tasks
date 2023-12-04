import requests
import os 
from dotenv import load_dotenv

load_dotenv()

# API KEY to be placed in an env variable
API_KEY = os.environ.get('WEATHER_API_KEY')

# Get input from user
get_city = input("Enter name of the city: ")

# Parameters for GeoCoding API 
params1 = {
    "q": get_city,
    "appid": API_KEY
}

# Get request to convert city name to geolocation coordindates
response = requests.get(url="http://api.openweathermap.org/geo/1.0/direct", params=params1)

# Include error handling 
try:
    lat_coord = response.json()[0]["lat"]
    lon_coord = response.json()[0]["lon"]

    params2 = {
    "lat": lat_coord,
    "lon": lon_coord,
    "appid": API_KEY
}

    # Get request to retrive weather data
    response = requests.get(url="https://api.openweathermap.org/data/2.5/weather", params=params2)
    data = response.json()
    temp = round(data["main"]["temp"] - 273.15, 1)
    humidity = data["main"]["humidity"]
    wind_speed = data["wind"]["speed"]
    description = data["weather"][0]["description"]

    # Print CLI
    print(f"\nWeather in {get_city.capitalize()}:")
    print(f"- Tempeature: {temp}°C")
    print(f"- Humidity: {humidity}%")
    print(f"- Wind Speed: {wind_speed} m/s")
    print(f"- Description: {description.capitalize()}\n")

except IndexError: 
    print("Sorry, location not found!\n")

except KeyError:
    print("Failed request:", "Error", response.status_code)
    




