import { fetchFromProvider, fetchFromMultipleProviders } from './providers/index.js';
import { config, cache } from '../config.js';

/**
 * GET /weather/current
 * Query params:
 *   - location: City name (required)
 *   - provider: Specific provider to use (optional, defaults to all available)
 *   - units: 'imperial' or 'metric' (optional, defaults to 'imperial')
 */
const getCurrentWeather = async (req, res) => {
    const WEATHERAPI_API_KEY = config.weatherapi.apiKey;
    const OPENWEATHERMAP_API_KEY = config.openweathermap.apiKey;
    
    const { location, provider, units = 'imperial' } = req.query;

    if (!location) {
        return res.status(400).json({ error: 'Location parameter is required' });
    }

    // Check cache
    const cacheKey = { location, provider, units };
    const cached = cache.get(cacheKey);
    if (cached) {
        return res.json({ ...cached, cached: true });
    }

    try {
        // Single provider request
        if (provider) {
            const apiKey = provider === 'openweathermap' ? OPENWEATHERMAP_API_KEY : WEATHERAPI_API_KEY;

            if (!apiKey) {
                return res.status(404).json({
                    error: `API key for provider "${provider}" not configured`
                });
            }

            const data = await fetchFromProvider(provider, location, apiKey, units);
            return res.json(data);
        }

        // Multiple providers request
        const providerConfigs = [];
        if (WEATHERAPI_API_KEY) {
            providerConfigs.push({ name: 'weatherapi', apiKey: WEATHERAPI_API_KEY });
        }
        if (OPENWEATHERMAP_API_KEY) {
            providerConfigs.push({ name: 'openweathermap', apiKey: OPENWEATHERMAP_API_KEY });
        }

        if (providerConfigs.length === 0) {
            return res.status(500).json({ error: 'No weather API keys configured' });
        }

        const { successful, failed } = await fetchFromMultipleProviders(providerConfigs, location, units);

        res.json({
            location,
            units,
            providers: successful,
            errors: failed.length > 0 ? failed : undefined
        });

    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Failed to fetch weather data', details: error.message });
    }
}

const getForecast = (req, res) => {
    console.log('hi hello forecast')
    res.json({
        location: 'San Francisco',
        forecast: [
            { day: 'Monday', high: '18°C', low: '12°C', condition: 'Sunny' },
            { day: 'Tuesday', high: '17°C', low: '11°C', condition: 'Partly Cloudy' },
            { day: 'Wednesday', high: '16°C', low: '10°C', condition: 'Rain' },
        ]
    });
}

export default {
    getCurrentWeather,
    getForecast
};
