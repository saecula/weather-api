import axios from 'axios';

const BASE_URL = 'https://api.weather.gov/points';

// todo: normalize fetch and normalize signatures
export const fetchCurrent = async (lat, lon, units = 'imperial') => {
    try {
        // get point metadata
        const pointUrl = `${BASE_URL}/${lat},${lon}`;
        const pointResponse = await axios.get(pointUrl, {
            headers: {
                'User-Agent': 'WeatherAPI/1.0'
            }
        });
        const pointData = pointResponse.data;

        const gridDataUrl = pointData.properties.forecastGridData;
        if (!gridDataUrl) {
            throw new Error('NOAA API did not return forecastGridData URL');
        }

        // get data with actual temperature
        const gridResponse = await axios.get(gridDataUrl, {
            headers: {
                'User-Agent': 'WeatherAPI/1.0'
            }
        });
        const gridData = gridResponse.data;

        return {
            point: pointData,
            grid: gridData,
            units
        };
    } catch (error) {
        if (error.response) {
            throw new Error(`NOAA API error: ${error.response.status} - ${error.response.statusText}`);
        }
        throw error;
    }
};

export const normalizeCurrent = (data, units = 'imperial') => {
    const pointData = data.point;
    const gridData = data.grid;

    const tempData = gridData.properties.temperature;
    const tempCelsius = tempData.values[0].value;

    const timezone = pointData.properties.timeZone;
    const timestamp = new Date();

    const temperature = units === 'imperial'
        ? Math.round(tempCelsius * 9 / 5 + 32)
        : Math.round(tempCelsius);

    return {
        location: {
            lat: pointData.geometry.coordinates[1],
            lon: pointData.geometry.coordinates[0],
            name: pointData.properties.relativeLocation.properties.city,
            state: pointData.properties.relativeLocation.properties.state,
            country: 'US'
        },
        current: {
            temperature: temperature,
            feels_like: temperature,
            condition: 'Unknown',
            humidity: null,
            wind_speed: null,
            wind_direction: null,
            pressure: null,
            visibility: null,
            cloud_cover: null,
            uv_index: null
        },
        units,
        provider: 'noaa',
        timestamp: timestamp.toISOString(),
        timezone,
        local_time: timestamp.toLocaleString('en-US', { timeZone: timezone })
    };
};