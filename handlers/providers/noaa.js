import axios from 'axios';

const BASE_URL = 'https://api.weather.gov/points';

export const fetchCurrent = async (lat, lon) => {
    const url = `${BASE_URL}/${lat},${lon}`;
    const response = await axios.get(url, {
        headers: {
            'User-Agent': 'WeatherAPI/1.0'
        }
    });
    return response.data;
};

export const normalizeCurrent = (data) => {
    const timestamp = new Date();
    const timezone = data.properties.timeZone;

    return {
        location: {
            lat: data.geometry.coordinates[1],
            lon: data.geometry.coordinates[0],
            name: data.properties.relativeLocation.properties.city,
            state: data.properties.relativeLocation.properties.state
        },
        metadata: {
            cwa: data.properties.cwa,
            forecastOffice: data.properties.forecastOffice,
            gridId: data.properties.gridId,
            gridX: data.properties.gridX,
            gridY: data.properties.gridY,
            forecast: data.properties.forecast,
            forecastHourly: data.properties.forecastHourly,
            forecastGridData: data.properties.forecastGridData,
            observationStations: data.properties.observationStations,
            forecastZone: data.properties.forecastZone,
            county: data.properties.county,
            radarStation: data.properties.radarStation
        },
        provider: 'noaa',
        timestamp: timestamp.toISOString(),
        timezone,
        local_time: timestamp.toLocaleString('en-US', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(/(\d+)\/(\d+)\/(\d+),\s(\d+):(\d+):(\d+)/, '$3-$1-$2T$4:$5:$6')
    };
};