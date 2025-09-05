import http, { IncomingMessage } from "http";
import dotenv from "dotenv";

dotenv.config();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY as string;
const NEWS_API_KEY = process.env.NEWS_API_KEY as string;

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
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`,
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
    console.log(`Weather in ${cityname}:`);
    console.log(`Temperature: ${weatherData.main.temp}°C`);
    console.log(`Feels like: ${weatherData.main.feels_like}°C`);
    console.log(`Condition: ${weatherData.weather[0].description}`);
  }, 2000);
};

getLocation("Pretoria", (error, lat, lon, cityname) => {
  if (error) return console.log("Location error:", error.message);

  fetchCurrentWeather(lat!, lon!, cityname!, (error, city, data) => {
    if (error) return console.log("WeatherData error:", error.message);

    displayForecast(city!, data);
  });
});

const getCountry = (
  countryPrefix: string,
  callback: (error: Error | null, prefix?: string) => void
) => {
  if (countryPrefix) {
    console.log(`Recieving country prefix...`);
    callback(null, countryPrefix);
  } else {
    callback(new Error(`Country not found`));
  }
};

const fetchHeadlines = (
  countryPrefix: string,
  callback: (error: Error | null, headlines?: any) => void
) => {
  console.log(`featching Top headlines for ${countryPrefix}`);
  http
    .get(
      `http://api.mediastack.com/v1/news?access_key=${NEWS_API_KEY}&categories=general&countries=${countryPrefix}`,
      (res: IncomingMessage) => {
        let headlines = "";

        if (res.statusCode !== 200) {
          callback(new Error(`Request failed with status ${res.statusCode}`));
          res.resume();
          return;
        }

        res.on("data", (chunck) => {
          headlines += chunck;
        });

        res.on("end", () => {
          try {
            const headlinesData = JSON.parse(headlines);

            if (!headlinesData) {
              callback(new Error(`No headlines data found`));
            }
            callback(null, headlinesData);
          } catch (error) {
            callback(error as Error);
          }
        });
      }
    )
    .on("error", (err) => callback(err));
};

const displayNews = (headlines: any) => {
  console.log(`Displaying Headlines`);

  setTimeout(() => {
    console.log(`Top Headlines :`);
    headlines.data.forEach((data: any) => {
      console.log(`Title: ${data.title || "N/A"}`);
      console.log(`Description: ${data.description || "N/A"}`);
      console.log(
        `Published at: ${
          data.published_at
            ? new Intl.DateTimeFormat("en-GB").format(
                new Date(data.published_at)
              )
            : "N/A"
        }`
      );
    });
  }, 2000);
};

getCountry("za", (err, countryPrefix) => {
  if (err) {
    console.error("Country error:", err.message);
    return;
  }

  fetchHeadlines(countryPrefix!, (err, headlines) => {
    if (err) {
      console.error("Headlines error:",err.message);
      return;
    }
    displayNews(headlines);
  });
});
