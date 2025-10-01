import axios from 'axios';

const BASE_URL = 'https://api.weatherapi.com/v1/current.json';

/**
 * Fetches current weather from WeatherAPI
 */
export const fetchCurrent = async (location, apiKey) => {
    const url = `${BASE_URL}?key=${apiKey}&q=${encodeURIComponent(location)}`;
    const response = await axios.get(url);
    return response.data;
};

/**
 * Normalizes WeatherAPI response to standard format
 */
export const normalizeCurrent = (data, units = 'imperial') => {
    return {
        location: {
            lat: data.location.lat,
            lon: data.location.lon,
            name: data.location.name,
            country: data.location.country,
            timezone: data.location.tz_id
        },
        current: {
            temperature: units === 'imperial' ? data.current.temp_f : data.current.temp_c,
            feels_like: units === 'imperial' ? data.current.feelslike_f : data.current.feelslike_c,
            condition: data.current.condition.text,
            humidity: data.current.humidity,
            wind_speed: units === 'imperial' ? data.current.wind_mph : data.current.wind_kph,
            wind_direction: data.current.wind_dir,
            pressure: units === 'imperial' ? data.current.pressure_in : data.current.pressure_mb,
            visibility: units === 'imperial' ? data.current.vis_miles : data.current.vis_km,
            cloud_cover: data.current.cloud,
            uv_index: data.current.uv
        },
        units,
        provider: 'weatherapi',
        updated_at: new Date(data.current.last_updated_epoch * 1000).toISOString()
    };
};