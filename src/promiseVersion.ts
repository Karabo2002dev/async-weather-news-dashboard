import http, { IncomingMessage } from "http";
import dotenv from "dotenv";

dotenv.config();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY as string;
const NEWS_API_KEY = process.env.NEWS_API_KEY as string;

const promiseGetLocation = (
  city: string
): Promise<{
  lat: number;
  lon: number;
  name: string;
}> => {
  return new Promise((resolve, reject) => {
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
                reject(new Error(`No results found for ${city}`));
              }
              const { lat, lon, name } = json[0];
              resolve({ lat, lon, name });
            } catch (error) {
              reject(error as Error);
            }
          });
        }
      )
      .on("error", (err) => reject(err));
  });
};

const promiseFetchCurrentWeather = (
  lat: number,
  lon: number,
  cityname: string
): Promise<{ cityname: string; weatherData: any }> => {
  return new Promise((resolve, reject) => {
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
                reject(new Error(`Weather data not found`));
              } else {
                resolve({ cityname, weatherData: currentWeatherData });
              }
            } catch (error) {
              reject(error);
            }
          });
        }
      )
      .on("error", (err) => reject(err)); 
  });
};

const promiseDisplayForecast = (
  cityname: string,
  weatherData: any
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Weather in ${cityname}:`);
      console.log(`Temperature: ${weatherData.main.temp}°C`);
      console.log(`Feels like: ${weatherData.main.feels_like}°C`);
      console.log(`Condition: ${weatherData.weather[0].description}`);
      resolve();
    }, 2000);
  });
};

promiseGetLocation("Pretoria")
  .then(({ lat, lon, name }) => {
    return promiseFetchCurrentWeather(lat, lon, name);
  })
  .then(({ cityname, weatherData }) => {
    return promiseDisplayForecast(cityname, weatherData);
  })
  .catch((error) => console.error("An error occured:", error.message));

const promiseGetCountry = (countryPrefix: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (countryPrefix) {
      console.log(`Receiving country prefix...`);
      resolve(countryPrefix);
    } else {
      reject(new Error(`Country not found`));
    }
  });
};

const promiseFetchHeadlines = (countryPrefix: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    console.log(`Fetching Top headlines for ${countryPrefix}`);

    http
      .get(
        `http://api.mediastack.com/v1/news?access_key=${NEWS_API_KEY}&categories=general&countries=${countryPrefix}`,
        (res: IncomingMessage) => {
          let headlines = "";

          if (res.statusCode !== 200) {
            reject(new Error(`Request failed with status ${res.statusCode}`));
            res.resume();
            return;
          }

          res.on("data", (chunk) => {
            headlines += chunk;
          });

          res.on("end", () => {
            try {
              const headlinesData = JSON.parse(headlines);

              if (!headlinesData) {
                reject(new Error(`No headlines data found`));
              } else {
                resolve(headlinesData);
              }
            } catch (error) {
              reject(error);
            }
          });
        }
      )
      .on("error", (err) => reject(err));
  });
};

const promiseDisplayNews = (headlines: any) => {
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

promiseGetCountry("za")
  .then((countryPrefix) => {
    return promiseFetchHeadlines(countryPrefix);
  })
  .then((headlines) => {
    return promiseDisplayNews(headlines);
  })
  .catch((error) => console.error("An error has occured :", error.message));

