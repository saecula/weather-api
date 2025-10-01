import axios from 'axios';

const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

/**
 * Fetches current weather from OpenWeatherMap API
 */
export const fetchCurrent = async (location, apiKey, units = 'imperial') => {
    const url = `${BASE_URL}?q=${encodeURIComponent(location)}&appid=${apiKey}&units=${units}`;
    const response = await axios.get(url);
    return response.data;
};

/**
 * Normalizes OpenWeatherMap response to standard format
 */
export const normalizeCurrent = (data, units = 'imperial') => {
    const windDirections = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const windDirection = windDirections[Math.round(data.wind.deg / 22.5) % 16];

    const timezone = getTimezoneFromOffset(data.timezone);
    const timestamp = new Date(data.dt * 1000);
    const localTime = formatLocalTime(timestamp, data.timezone);

    return {
        location: {
            lat: data.coord.lat,
            lon: data.coord.lon,
            name: data.name,
            country: data.sys.country
        },
        current: {
            temperature: Math.round(data.main.temp),
            feels_like: Math.round(data.main.feels_like * 10) / 10,
            condition: data.weather[0].main,
            humidity: data.main.humidity,
            wind_speed: Math.round(data.wind.speed * 10) / 10,
            wind_direction: windDirection,
            pressure: units === 'imperial'
                ? Math.round(data.main.pressure * 0.02953 * 100) / 100
                : data.main.pressure,
            visibility: units === 'imperial'
                ? Math.round(data.visibility / 1609.34)
                : Math.round(data.visibility / 1000),
            cloud_cover: data.clouds.all,
            uv_index: 0 // OpenWeatherMap doesn't provide UV in free tier
        },
        units,
        provider: 'openweathermap',
        timestamp: timestamp.toISOString(),
        timezone,
        local_time: localTime
    };
};

/**
 * Converts timezone offset (seconds) to IANA timezone string (approximation)
 */
const getTimezoneFromOffset = (offsetSeconds) => {
    const offsetHours = offsetSeconds / 3600;
    // This is a simplified mapping - in production, you'd use a proper timezone library
    const timezoneMap = {
        '-5': 'America/New_York',
        '-6': 'America/Chicago',
        '-7': 'America/Denver',
        '-8': 'America/Los_Angeles',
        '0': 'UTC',
        '1': 'Europe/Paris',
        '2': 'Europe/Athens'
    };
    return timezoneMap[offsetHours.toString()] || `UTC${offsetHours >= 0 ? '+' : ''}${offsetHours}`;
};

/**
 * Formats local time with timezone offset
 */
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