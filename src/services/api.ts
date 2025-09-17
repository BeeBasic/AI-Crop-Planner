// import axios from "axios";

// const OPENWEATHER_API_KEY = "f273e9ce95f51d30254d4775f42c5a72";
// // const LIBRETRANSLATE_URL = "https://libretranslate.com";
// // const LIBRETRANSLATE_URL = "https://translate.astian.org";
// // const LIBRETRANSLATE_URL = "https://translate.argosopentech.com";
// const LIBRETRANSLATE_URL = "https://libretranslate.de";

// // SoilGrids API
// const SOILGRIDS_BASE_URL =
//   "https://rest.isric.org/soilgrids/v2.0/properties/query";




// // OpenWeather API
// export const weatherAPI = {
//   getCurrentWeather: async (lat: number, lon: number) => {
//     try {
//       const response = await axios.get(
//         `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching weather data:", error);
//       throw error;
//     }
//   },

//   getForecast: async (lat: number, lon: number) => {
//     try {
//       const response = await axios.get(
//         `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching forecast data:", error);
//       throw error;
//     }
//   },
// };

// // SoilGrids API: fetch topsoil Nitrogen (N) and pH (phh2o)
// export const soilAPI = {
//   getTopsoilNandPH: async (lat: number, lon: number) => {
//     try {
//       // Validate and clamp coordinates
//       if (Number.isNaN(lat) || Number.isNaN(lon)) {
//         throw new Error("Invalid coordinates provided to SoilGrids");
//       }
//       lat = Math.max(-90, Math.min(90, lat));
//       lon = Math.max(-180, Math.min(180, lon));

//       // First attempt: minimal params (some SoilGrids deployments 500 on depth/value)
//       let response = await axios.get(SOILGRIDS_BASE_URL, {
//         params: {
//           lon,
//           lat,
//           property: "nitrogen,phh2o",
//         },
//         headers: { Accept: "application/json" },
//       });
//       const data = response.data;

//       // Response is a FeatureCollection with one feature
//       // Extract mean values from layers by name
//       const layers = data?.properties?.layers || data?.layers || [];

//       let nitrogen: number | null = null;
//       let ph: number | null = null;

//       for (const layer of layers) {
//         const name = layer?.name || layer?.variable || "";
//         const depths = layer?.depths || [];
//         const firstDepth = depths[0];
//         const values = firstDepth?.values || {};
//         const mean = typeof values?.mean === "number" ? values.mean : null;

//         if (name.toLowerCase().includes("nitrogen")) {
//           nitrogen = typeof mean === "number" ? mean : nitrogen;
//         }
//         if (name.toLowerCase().includes("phh2o") || name.toLowerCase() === "ph") {
//           // SoilGrids pH is often scaled by 10 (e.g., 65 => 6.5)
//           ph = typeof mean === "number" ? mean / 10 : ph;
//         }
//       }

//       if (nitrogen == null || ph == null) {
//         // Fallback attempt with explicit depth and mean
//         response = await axios.get(SOILGRIDS_BASE_URL, {
//           params: {
//             lon,
//             lat,
//             property: "nitrogen,phh2o",
//             depth: "0-5cm",
//             value: "mean",
//           },
//           headers: { Accept: "application/json" },
//         });
//         const data2 = response.data;
//         const layers2 = data2?.properties?.layers || data2?.layers || [];
//         for (const layer of layers2) {
//           const name = layer?.name?.toLowerCase?.() || layer?.variable?.toLowerCase?.() || "";
//           const depths = layer?.depths || [];
//           const firstDepth = depths[0];
//           const values = firstDepth?.values || {};
//           const mean = typeof values?.mean === "number" ? values.mean : null;
//           if (name.includes("nitrogen")) {
//             nitrogen = typeof mean === "number" ? mean : nitrogen;
//           }
//           if (name.includes("phh2o") || name === "ph") {
//             ph = typeof mean === "number" ? mean / 10 : ph;
//           }
//         }
//       }

//       // If still missing, query properties separately (some servers fail on comma-joined properties)
//       if (nitrogen == null) {
//         const rN = await axios.get(SOILGRIDS_BASE_URL, {
//           params: { lon, lat, property: "nitrogen", depth: "0-5cm", value: "mean" },
//           headers: { Accept: "application/json" },
//         });
//         const layersN = rN.data?.properties?.layers || rN.data?.layers || [];
//         for (const layer of layersN) {
//           const depths = layer?.depths || [];
//           const firstDepth = depths[0];
//           const values = firstDepth?.values || {};
//           const mean = typeof values?.mean === "number" ? values.mean : null;
//           if (typeof mean === "number") nitrogen = mean;
//         }
//       }
//       if (ph == null) {
//         const rPH = await axios.get(SOILGRIDS_BASE_URL, {
//           params: { lon, lat, property: "phh2o", depth: "0-5cm", value: "mean" },
//           headers: { Accept: "application/json" },
//         });
//         const layersPH = rPH.data?.properties?.layers || rPH.data?.layers || [];
//         for (const layer of layersPH) {
//           const depths = layer?.depths || [];
//           const firstDepth = depths[0];
//           const values = firstDepth?.values || {};
//           const mean = typeof values?.mean === "number" ? values.mean : null;
//           if (typeof mean === "number") ph = mean / 10;
//         }
//       }

//       if (nitrogen == null || ph == null) {
//         throw new Error("Failed to parse SoilGrids response for N and pH");
//       }

//       return { N: nitrogen, ph } as { N: number; ph: number };
//     } catch (error) {
//       const err: any = error;
//       const status = err?.response?.status;
//       const body = err?.response?.data;
//       const config = err?.config;
//       const attemptedUrl = config ? (axios as any).getUri?.(config) || config?.url : SOILGRIDS_BASE_URL;
//       console.error("Error fetching soil data:", {
//         status,
//         message: err?.message,
//         url: attemptedUrl,
//         params: config?.params,
//         body,
//       });

//       // FINAL FALLBACK so the app can continue showing recommendations
//       console.warn("Using fallback Soil values due to SoilGrids failure (N=0.1, pH=7.0)");
//       return { N: 0.1, ph: 7.0 };
//     }
//   },
// };

// // Model API (Flask backend at http://127.0.0.1:5001)
// export const modelAPI = {
//   predictCrop: async (features: {
//     N: number;
//     ph: number;
//     temperature: number;
//     humidity: number;
//     rainfall: number;
//   }) => {
//     try {
//       const response = await axios.post("http://127.0.0.1:5001/predict", features, {
//         headers: { "Content-Type": "application/json" },
//       });
//       return response.data as { predicted_crop: string };
//     } catch (error) {
//       console.error("Error calling model predict API:", (error as any)?.response?.data || error);
//       throw error;
//     }
//   },
//   predictTop3: async (features: {
//     N: number;
//     ph: number;
//     temperature: number;
//     humidity: number;
//     rainfall: number;
//   }) => {
//     try {
//       const response = await axios.post("http://127.0.0.1:5001/predict-top3", features, {
//         headers: { "Content-Type": "application/json" },
//       });
//       return response.data as { top3: Array<{ name: string; score: number }> };
//     } catch (error) {
//       console.error("Error calling model predict top3 API:", (error as any)?.response?.data || error);
//       throw error;
//     }
//   },
// };

// // LibreTranslate API
// export const translateAPI = {
//   getLanguages: async () => {
//     try {
//       const response = await axios.get(`${LIBRETRANSLATE_URL}/languages`, {
//         headers: { Accept: "application/json" },
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching languages:", error);
//       throw error;
//     }
//   },

//   // translate: async (text: string, source: string, target: string) => {
//   //   try {
//   //     const response = await axios.post(
//   //       `${LIBRETRANSLATE_URL}/translate`,
//   //       {
//   //         q: text,
//   //         source,
//   //         target,
//   //         format: "text",
//   //       },
//   //       {
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //           Accept: "application/json",
//   //         },
//   //       }
//   //     );
//   //     return response.data.translatedText;
//   //   } catch (error) {
//   //     console.error("Error translating text:", error);
//   //     throw error;
//   //   }
//   // },

//   translate: async (text: string, source: string, target: string) => {
//     try {
//       if (!text?.trim()) {
//         throw new Error("Translation text cannot be empty.");
//       }
//       if (!target) {
//         throw new Error("Target language must be provided.");
//       }

//       const response = await axios.post(
//         `${LIBRETRANSLATE_URL}/translate`,
//         {
//           q: text,
//           source: source || "auto", // fallback to auto-detect
//           target,
//           format: "text",
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },
//         }
//       );

//       return response.data.translatedText;
//     } catch (error) {
//       console.error(
//         "Error translating text:",
//         error.response?.data || error.message
//       );
//       throw error;
//     }
//   },
// };

// // Geolocation helper
// export const locationAPI = {
//   getCurrentPosition: (): Promise<GeolocationPosition> => {
//     return new Promise((resolve, reject) => {
//       if (!navigator.geolocation) {
//         reject(new Error("Geolocation is not supported by this browser."));
//         return;
//       }

//       navigator.geolocation.getCurrentPosition(
//         (position) => resolve(position),
//         (error) => reject(error),
//         {
//           enableHighAccuracy: true,
//           timeout: 10000,
//           maximumAge: 60000,
//         }
//       );
//     });
//   },
// };








import axios from "axios";

const OPENWEATHER_API_KEY = "f273e9ce95f51d30254d4775f42c5a72";
const TRANSLATE_API_URL = "http://localhost:5001/translate";

// SoilGrids API
const SOILGRIDS_BASE_URL =
  "https://rest.isric.org/soilgrids/v2.0/properties/query";




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

  getAverageRainfall: async (lat: number, lon: number) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );
      const data = response.data;
      
      // Calculate 10-day average rainfall from 5-day forecast (3-hour intervals)
      const forecasts = data?.list || [];
      let totalRainfall = 0;
      let rainCount = 0;
      
      // Take first 10 days worth of data (10 days * 8 forecasts per day = 80 forecasts)
      const tenDayForecasts = forecasts.slice(0, 80);
      
      for (const forecast of tenDayForecasts) {
        const rain = forecast?.rain?.['3h'] || 0;
        totalRainfall += rain;
        rainCount++;
      }
      
      const averageRainfall = rainCount > 0 ? totalRainfall / rainCount : 0;
      return averageRainfall;
    } catch (error) {
      console.error("Error fetching average rainfall:", error);
      // Return current rainfall as fallback
      try {
        const current = await weatherAPI.getCurrentWeather(lat, lon);
        return (current?.rain?.['1h'] || current?.rain?.['3h'] || 0);
      } catch {
        return 0;
      }
    }
  },
};

export const soilAPI = {
  getTopsoilNandPH: async (lat: number, lon: number) => {
    try {
      if (Number.isNaN(lat) || Number.isNaN(lon)) {
        throw new Error("Invalid coordinates provided to SoilGrids");
      }
      lat = Math.max(-90, Math.min(90, lat));
      lon = Math.max(-180, Math.min(180, lon));

      let nitrogen: number | null = null;
      let ph: number | null = null;

      // Fetch Nitrogen
      const respN = await axios.get(SOILGRIDS_BASE_URL, {
        params: { lon, lat, property: "nitrogen", depth: "0-5cm", value: "mean" },
        headers: { Accept: "application/json" },
      });
      const layersN = respN.data?.properties?.layers || [];
      for (const layer of layersN) {
        const mean = layer?.depths?.[0]?.values?.mean;
        if (typeof mean === "number") nitrogen = mean;
      }

      // Fetch pH
      const respPH = await axios.get(SOILGRIDS_BASE_URL, {
        params: { lon, lat, property: "phh2o", depth: "0-5cm", value: "mean" },
        headers: { Accept: "application/json" },
      });
      const layersPH = respPH.data?.properties?.layers || [];
      for (const layer of layersPH) {
        const mean = layer?.depths?.[0]?.values?.mean;
        if (typeof mean === "number") ph = mean / 10; // SoilGrids gives pH*10
      }

      if (nitrogen == null || ph == null) {
        throw new Error("Failed to parse SoilGrids response for N and pH");
      }

      return { N: nitrogen, ph };
    } catch (error) {
      console.error("Error fetching soil data:", error?.response?.data || error.message);
      return { N: 0.1, ph: 7.0 }; // safe fallback
    }
  },
};


// Model API (Flask backend at http://127.0.0.1:5001)
export const modelAPI = {
  predictCrop: async (features: {
    N: number;
    ph: number;
    temperature: number;
    humidity: number;
    rainfall: number;
  }) => {
    try {
      const response = await axios.post("http://127.0.0.1:5001/predict", features, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data as { predicted_crop: string };
    } catch (error) {
      console.error("Error calling model predict API:", (error as any)?.response?.data || error);
      throw error;
    }
  },
  predictTop3: async (features: {
    N: number;
    ph: number;
    temperature: number;
    humidity: number;
    rainfall: number;
  }) => {
    try {
      const response = await axios.post("http://127.0.0.1:5001/predict-top3", features, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data as { top3: Array<{ name: string; score: number }> };
    } catch (error) {
      console.error("Error calling model predict top3 API:", (error as any)?.response?.data || error);
      throw error;
    }
  },
  predictPrices: async (crops: string[], latitude: number, longitude: number) => {
    try {
      const response = await axios.post("http://127.0.0.1:5001/predict-prices", {
        crops,
        latitude,
        longitude
      }, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data as { 
        price_predictions: Array<{
          crop_name: string;
          predicted_price_90d: number;
          current_price: number;
          price_change: number;
          price_change_percent: number;
          harvest_month: string;
        }>
      };
    } catch (error) {
      console.error("Error calling price prediction API:", (error as any)?.response?.data || error);
      throw error;
    }
  },
};

// MyMemory Translation API
export const translateAPI = {
  getLanguages: async () => {
    // Return supported languages for English-Hindi translation
    return [
      { code: 'en', name: 'English' },
      { code: 'hi', name: 'Hindi' }
    ];
  },

  translate: async (text: string, source: string, target: string) => {
    try {
      if (!text?.trim()) {
        return text;
      }
      if (!target) {
        return text;
      }

      // Only support English to Hindi and Hindi to English
      if (!((source === 'en' && target === 'hi') || (source === 'hi' && target === 'en') || (source === 'auto' && target === 'hi'))) {
        return text; // Return original text if translation not supported
      }

      const response = await axios.post(TRANSLATE_API_URL, {
        text: text,
        source: source,
        target: target
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      });

      if (response.data && response.data.translatedText) {
        return response.data.translatedText;
      } else {
        return text; // Return original text if translation fails
      }
    } catch (error) {
      console.error("Translation error:", error.message);
      return text; // Return original text on error
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