import * as openweathermap from './openweathermap.js';
import * as weatherapi from './weatherapi.js';
import * as noaa from './noaa.js';
import { config } from '../../config.js';

const providerModules = {
    openweathermap,
    weatherapi,
    noaa
};

export const getProviderConfig = (providerName) => {
    return config[providerName];
};

export const fetchFromProvider = async (providerName, opts) => {
    const { lat, lon, units } = opts;

    const providerConfig = config[providerName];
    if (!providerConfig) {
        throw new Error(`Provider "${providerName}" not found`);
    }

    const provider = providerModules[providerName];

    const rawData = providerConfig.requiresApiKey
        ? await provider.fetchCurrent(lat, lon, providerConfig.apiKey, units)
        : await provider.fetchCurrent(lat, lon, units);

    return provider.normalizeCurrent(rawData, units);
};
