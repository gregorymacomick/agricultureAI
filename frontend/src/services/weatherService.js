import axios from "axios";

const API_KEY = "4c11fa82d03540fe0808343af5859ad9";

export const getWeather = async (lat, lon) => {

  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather`,
    {
      params: {
        lat,
        lon,
        units: "metric",
        appid: API_KEY
      }
    }
  );

  return response.data;
};