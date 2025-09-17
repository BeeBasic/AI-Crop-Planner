import axios from "axios";

const OPENWEATHER_API_KEY = "f273e9ce95f51d30254d4775f42c5a72";
// const LIBRETRANSLATE_URL = "https://libretranslate.com";
// const LIBRETRANSLATE_URL = "https://translate.astian.org";
// const LIBRETRANSLATE_URL = "https://translate.argosopentech.com";
const LIBRETRANSLATE_URL = "https://libretranslate.de";




// OpenWeather API
export const weatherAPI = {
  getCurrentWeather: async (lat: number, lon: number) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw error;
    }
  },

  getForecast: async (lat: number, lon: number) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching forecast data:", error);
      throw error;
    }
  },
};

// LibreTranslate API
export const translateAPI = {
  getLanguages: async () => {
    try {
      const response = await axios.get(`${LIBRETRANSLATE_URL}/languages`, {
        headers: { Accept: "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching languages:", error);
      throw error;
    }
  },

  // translate: async (text: string, source: string, target: string) => {
  //   try {
  //     const response = await axios.post(
  //       `${LIBRETRANSLATE_URL}/translate`,
  //       {
  //         q: text,
  //         source,
  //         target,
  //         format: "text",
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Accept: "application/json",
  //         },
  //       }
  //     );
  //     return response.data.translatedText;
  //   } catch (error) {
  //     console.error("Error translating text:", error);
  //     throw error;
  //   }
  // },

  translate: async (text: string, source: string, target: string) => {
    try {
      if (!text?.trim()) {
        throw new Error("Translation text cannot be empty.");
      }
      if (!target) {
        throw new Error("Target language must be provided.");
      }

      const response = await axios.post(
        `${LIBRETRANSLATE_URL}/translate`,
        {
          q: text,
          source: source || "auto", // fallback to auto-detect
          target,
          format: "text",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      return response.data.translatedText;
    } catch (error) {
      console.error(
        "Error translating text:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

// Geolocation helper
export const locationAPI = {
  getCurrentPosition: (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  },
};
