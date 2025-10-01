import { fetchFromProvider, getProviderConfig } from './providers/index.js';
import cache from '../util/cache.js';
import logger from '../util/logger.js';

const validProviders = ['weatherapi', 'openweathermap', 'noaa'];

/**
- lat: latitude (required)
- lon: longitude (required)
- provider: Specific provider to use (optional, defaults to openweathermap)
- units: 'imperial' or 'metric' (optional, defaults to 'imperial')
 */
const getCurrentWeather = async (req, res) => {
    const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY

    const { lat, lon, provider: selectedProvider, units = 'imperial' } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ error: 'Missing required query parameters: lat, lon' });
    }

    if (isNaN(lat) || isNaN(lon)) {
        return res.status(400).json({ error: 'Invalid lat or lon. Must be numeric values.' });
    }

    if (units !== 'imperial' && units !== 'metric') {
        return res.status(400).json({ error: 'Invalid units. Valid options are: imperial, metric' });
    }

    if (selectedProvider && !validProviders.includes(selectedProvider)) {
        return res.status(400).json({ error: `Invalid provider. Valid options are: ${validProviders.join(', ')}` });
    }

    const currentProvider = selectedProvider || (OPENWEATHERMAP_API_KEY ? 'openweathermap' : 'weatherapi');

    // could think more about this
    const cacheKey = `${lat},${lon}_${currentProvider}_${units}`;
    const cached = cache.get(cacheKey);

    if (cached) {
        logger.info('Cache hit', { cacheKey });
        return res.json({ ...cached, cached: true });
    }

    // todo: make a for/of loop over a list of all providers as fallbacks
    try {
        const data = await fetchFromProvider(currentProvider, { lat, lon, units });

        cache.set(cacheKey, data);
        logger.info('Fetched weather data', { lat, lon, currentProvider, units });
        return res.json(data);

    } catch (error) {
        logger.warn('Primary provider failed, attempting fallback', { error: error.message });
    }

    try {
        const fallbackProvider = currentProvider === 'openweathermap' || currentProvider === 'noaa' ? 'weatherapi' : 'openweathermap';

        const data = await fetchFromProvider(fallbackProvider, { lat, lon, units });

        cache.set(cacheKey, data);
        logger.info('Fetched fallback weather data', { lat, lon, currentProvider, units });
        return res.json({ data, isFallback: true, fallbackProvider });

    } catch (error) {
        logger.error('Failed to fetch weather data upon fallback', {
            lat,
            lon,
            currentProvider,
            units,
            error: error.message
        });
        res.status(500).json({ error: 'Failed to fetch weather data', details: error.message });
    }
}

export default {
    getCurrentWeather
};
