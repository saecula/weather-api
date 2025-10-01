import { fetchFromProvider } from './providers/index.js';
import { config } from '../config.js';
import cache from '../util/cache.js';
import logger from '../util/logger.js';

/**
 * GET /weather/current
 * Query params:
 *   - location: City name (required)
 *   - provider: Specific provider to use (optional, defaults to weatherapi)
 *   - units: 'imperial' or 'metric' (optional, defaults to 'imperial')
 */
const getCurrentWeather = async (req, res) => {
    const WEATHERAPI_API_KEY = config.weatherapi.apiKey;
    const OPENWEATHERMAP_API_KEY = config.openweathermap.apiKey;

    const { location, provider, units = 'imperial' } = req.query;

    if (!location) {
        return res.status(400).json({ error: 'Location parameter is required' });
    }

    const validProviders = ['weatherapi', 'openweathermap'];
    const selectedProvider = provider || (WEATHERAPI_API_KEY ? 'weatherapi' : 'openweathermap');

    if (!validProviders.includes(selectedProvider)) {
        return res.status(400).json({ error: `Invalid provider. Valid options are: ${validProviders.join(', ')}` });
    }

    // Check cache
    const cacheKey = `${location}_${provider}_${units}`;
    const cached = cache.get(cacheKey);
    if (cached) {
        logger.info('Cache hit', { cacheKey });
        return res.json({ ...cached, cached: true });
    }

    try {
            const apiKey = provider === 'openweathermap' ? OPENWEATHERMAP_API_KEY : WEATHERAPI_API_KEY;

            if (!apiKey) {
                return res.status(404).json({
                    error: `API key for provider "${provider}" not configured`
                });
            }

            const data = await fetchFromProvider(provider, location, apiKey, units);

            cache.set(cacheKey, data);

            logger.info('Fetched weather data', { location, provider, units });
            return res.json(data);
    } catch (error) {
        logger.error('Failed to fetch weather data', {
            location,
            provider,
            units,
            error: error.message
        });
        res.status(500).json({ error: 'Failed to fetch weather data', details: error.message });
    }
}

const getForecast = (req, res) => {
    logger.debug('Forecast endpoint called')
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
