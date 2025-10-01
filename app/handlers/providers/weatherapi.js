import axios from 'axios';

const BASE_URL = 'https://api.weatherapi.com/v1/current.json';
// get api key here instead of param

// todo: normalize fetch and normalize signatures
export const fetchCurrent = async (lat, lon, apiKey) => {
    const url = `${BASE_URL}?q=${lat},${lon}&key=${apiKey}`;
    const response = await axios.get(url);
    return response.data;
};

export const normalizeCurrent = (data, units = 'imperial') => {
    return {
        location: {
            lat: data.location.lat,
            lon: data.location.lon,
            name: data.location.name,
            country: data.location.country
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
        timestamp: new Date(data.current.last_updated_epoch * 1000).toISOString(),
        timezone: data.location.tz_id,
        local_time: data.location.localtime
    };
};