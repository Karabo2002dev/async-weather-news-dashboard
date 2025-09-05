import {
  promiseGetLocation,
  promiseGetCountry,
  promiseFetchCurrentWeather,
  promiseDisplayForecast,
  promiseDisplayNews,
  promiseFetchHeadlines,
} from "./promiseVersion";

async function fetchWeather(): Promise<void> {
  try {
    const location = await promiseGetLocation("Pretoria");
    const { cityname, weatherData } = await promiseFetchCurrentWeather(
      location.lat,
      location.lon,
      location.name
    );
    await promiseDisplayForecast(cityname, weatherData);
  } catch (error) {
    console.error("An error occurred in Weather flow:", (error as Error).message);
  }
}

async function fetchNews(): Promise<void> {
  try {
    const country = await promiseGetCountry("za");
    const headlines = await promiseFetchHeadlines(country);
    await promiseDisplayNews(headlines);
  } catch (error) {
    console.error("An error occurred in News flow:", (error as Error).message);
  }
}

async function FetchAll() {
  await Promise.all([fetchWeather(), fetchNews()]);
  console.log("Weather and News flows finished!");
}

FetchAll();
