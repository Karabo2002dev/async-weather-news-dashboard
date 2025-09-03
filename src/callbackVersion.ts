import http, { IncomingMessage } from "http";
import dotenv from "dotenv";

dotenv.config();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY as string;

const getLocation = (
  city: string,
  callback: (
    error: Error | null,
    lat?: number,
    lon?: number,
    cityname?: string
  ) => void
): void => {
  console.log("Getting Location....");
  http
    .get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${1}&appid=${WEATHER_API_KEY}`,
      (res: IncomingMessage) => {
        let geoLocation = "";
        res.on("data", (chunk) => {
          geoLocation += chunk;
        });

        res.on("end", () => {
          try {
            const json = JSON.parse(geoLocation);
            if (json.legnth === 0) {
              return callback(new Error(`No results found for ${city}`));
            }
            const { lat, lon, name } = json[0];
            callback(null, lat, lon, name);
          } catch (error) {
            callback(error as Error);
          }
        });
      }
    )
    .on("error", (err) => callback(err));
};

const fetchCurrentWeather = (
  lat: number,
  lon: number,
  cityname: string,
  callback: (error: Error | null, cityname?: string, weatherData?: any) => void
) => {
  console.log(`Fetching the current weather for ${cityname}`);
  http
    .get(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`,
      (res: IncomingMessage) => {
        let currentWeather = "";
        res.on("data", (chunk) => {
          currentWeather += chunk;
        });

        res.on("end", () => {
          try {
            const currentWeatherData = JSON.parse(currentWeather);
            if (!currentWeatherData) {
              return callback(new Error(`Weather data not found`));
            }
            callback(null, cityname, currentWeatherData);
          } catch (error) {
            callback(error as Error);
          }
        });
      }
    )
    .on("error", (err) => callback(err));
};

const displayForecast = (cityname: string, weatherData: any) => {
  setTimeout(() => {
    console.log(
      `The forecast for today for ${cityname} : ${JSON.stringify(
        weatherData.main
      )}`
    );
  }, 2000);
};

getLocation("Pretoria", (error, lat, lon, cityname) => {
  if (error) return console.log("Location error:", error.message);

  fetchCurrentWeather(lat!, lon!, cityname!, (error, city, data) => {
    if (error) return console.log("WeatherData error:", error.message);

    displayForecast(city!, data);
  });
});
