import axios from 'axios';

export const fetchRealtimeWeather = async (lat = 17.385, lon = 78.4867) => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=rain,precipitation,temperature_2m,relativehumidity_2m,windspeed_10m&timezone=Asia/Kolkata`;
    const res = await axios.get(url, { timeout: 5000 });
    return {
      success: true,
      data: res.data.current
    };
  } catch (error) {
    console.error("Open-Meteo API Error:", error);
    return { success: false };
  }
};
