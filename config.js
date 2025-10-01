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
        ttl: process.env.CACHE_TTL || 300000 // 5 minutes in milliseconds
    }
};

const validateConfig = () => {
    if (!config.weatherapi.apiKey && !config.openweathermap.apiKey) {
        throw new Error('At least one weather API key must be configured (WEATHERAPI_API_KEY or OPENWEATHERMAP_API_KEY)');
    }
};

validateConfig();

// Simple in-memory cache
class Cache {
    constructor() {
        this.store = new Map();
    }

    generateKey(params) {
        return JSON.stringify(params);
    }

    get(params) {
        const key = this.generateKey(params);
        const entry = this.store.get(key);

        if (!entry) return null;

        if (Date.now() > entry.expiry) {
            this.store.delete(key);
            return null;
        }

        return entry.data;
    }

    set(params, data, ttl = config.cache.ttl) {
        const key = this.generateKey(params);
        this.store.set(key, {
            data,
            expiry: Date.now() + ttl
        });
    }

    clear() {
        this.store.clear();
    }
}

export const cache = new Cache();