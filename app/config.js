import dotenv from 'dotenv';

dotenv.config();

export const config = {
    weatherapi: {
        requiresApiKey: true,
        apiKey: process.env.WEATHERAPI_API_KEY
    },
    openweathermap: {
        requiresApiKey: true,
        apiKey: process.env.OPENWEATHERMAP_API_KEY
    },
    noaa: {
        requiresApiKey: false
    },
    port: process.env.PORT || 3000,
    cache: {
        ttlSeconds: process.env.CACHE_TTL_SECONDS || 300 // 5 minutes
    }
};

const validateConfig = () => {
    if (!config.weatherapi.apiKey || !config.openweathermap.apiKey) {
        throw new Error('both API keys should be configured (WEATHERAPI_API_KEY or OPENWEATHERMAP_API_KEY)');
    }
};

validateConfig();
