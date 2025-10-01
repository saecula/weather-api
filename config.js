import dotenv from 'dotenv';

dotenv.config();

export const config = {
    weatherapi: {
        apiKey: process.env.WEATHERAPI_API_KEY
    },
    openweathermap: {
        apiKey: process.env.OPENWEATHERMAP_API_KEY
    },
    port: process.env.PORT || 3000,
    cache: {
        ttlSeconds: process.env.CACHE_TTL_SECONDS || 300 // 5 minutes
    }
};

const validateConfig = () => {
    if (!config.weatherapi.apiKey && !config.openweathermap.apiKey) {
        throw new Error('At least one weather API key must be configured (WEATHERAPI_API_KEY or OPENWEATHERMAP_API_KEY)');
    }
};

validateConfig();
