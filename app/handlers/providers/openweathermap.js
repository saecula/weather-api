import axios from 'axios';

const BASE_URL = 'https://api.openweathermap.org/data/3.0/onecall';
// get api key here instead of param

// todo: normalize fetch and normalize signatures
export const fetchCurrent = async (lat, lon, apiKey, units = 'imperial') => {
    const url = `${BASE_URL}?appid=${apiKey}&lat=${lat}&lon=${lon}&units=${units}`;
    const response = await axios.get(url);
    return response.data;
};

export const normalizeCurrent = (data, units = 'imperial') => {
    const timestamp = new Date(data.current.dt * 1000);
    const localTime = formatLocalTime(timestamp, data.timezone_offset);

    return {
        location: {
            lat: data.lat,
            lon: data.lon,
            name: null,
            country: null
        },
        current: {
            temperature: Math.round(data.current.temp),
            feels_like: Math.round(data.current.feels_like * 10) / 10,
            condition: data.current.weather[0].main,
            humidity: data.current.humidity,
            pressure: units === 'imperial'
                ? Math.round(data.current.pressure * 0.02953 * 100) / 100
                : data.current.pressure,
            visibility: units === 'imperial'
                ? Math.round(data.current.visibility / 1609.34)
                : Math.round(data.current.visibility / 1000),
            cloud_cover: data.current.clouds,
            uv_index: data.current.uvi
        },
        units,
        provider: 'openweathermap',
        timestamp: timestamp.toISOString(),
        timezone: data.timezone,
        local_time: localTime
    };
};

// format local time with timezone offset
const formatLocalTime = (timestamp, offsetSeconds) => {
    const offsetMinutes = offsetSeconds / 60;
    const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
    const offsetMins = Math.abs(offsetMinutes) % 60;
    const sign = offsetMinutes >= 0 ? '+' : '-';

    const localTimestamp = new Date(timestamp.getTime() + offsetSeconds * 1000);
    const isoString = localTimestamp.toISOString();
    const dateTimePart = isoString.substring(0, 19);

    return `${dateTimePart}${sign}${String(offsetHours).padStart(2, '0')}:${String(offsetMins).padStart(2, '0')}`;
};