import http, { IncomingMessage } from "http";
import dotenv from "dotenv";

dotenv.config();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY as string;

const getLocation = (
  city: string,
  callbackfetchCurrentWeather: (
    lat: number,
    lon: number,
    cityname: string
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
            const { lat, lon, name } = json[0];
            callbackfetchCurrentWeather(lat, lon, name);
          } catch (error) {
            console.log(error);
          }
        });
      }
    )
    .on("error", (err) => console.error("Request failed:", err.message));
};

const fetchCurrentWeather = (
  lat: number,
  lon: number,
  cityname: string,
  callback: (cityname: string, weatherData: any) => void
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
            callback(cityname, currentWeatherData);
          } catch (error) {
            console.log(error);
          }
        });
      }
    )
    .on("error", (err) => console.error("Request failed:", err.message));
};

const displayforeCast = (cityname: string, weatherData: any) => {
  setTimeout(() => {
    console.log(
      `The forecast for today for ${cityname} : ${JSON.stringify(
        weatherData.main
      )}`
    );
  }, 2000);
};

getLocation("Pretoria", (lat, lon, cityname) =>
  fetchCurrentWeather(lat, lon, cityname, (city, data) =>
    displayforeCast(city, data)
  )
);
