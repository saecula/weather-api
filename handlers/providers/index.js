import * as openweathermap from './openweathermap.js';
import * as weatherapi from './weatherapi.js';
import * as noaa from './noaa.js';

/**
 * Registry of all available weather providers
 */
const providers = {
    openweathermap,
    weatherapi,
    noaa
};

/**
 * Fetches current weather from a specific provider
 */
export const fetchFromProvider = async (providerName, location, apiKey, units = 'imperial') => {
    const provider = providers[providerName];
    if (!provider) {
        throw new Error(`Provider "${providerName}" not found`);
    }

    const rawData = await provider.fetchCurrent(location, apiKey, units);
    return provider.normalizeCurrent(rawData, units);
};

/**
 * Fetches current weather from multiple providers and returns all results
 */
export const fetchFromMultipleProviders = async (providerConfigs, location, units = 'imperial') => {
    const results = await Promise.allSettled(
        providerConfigs.map(({ name, apiKey }) =>
            fetchFromProvider(name, location, apiKey, units)
        )
    );

    const successful = [];
    const failed = [];

    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            successful.push(result.value);
        } else {
            failed.push({
                provider: providerConfigs[index].name,
                error: result.reason.message
            });
        }
    });

    return { successful, failed };
};

export const getAvailableProviders = () => Object.keys(providers);

export const isProviderAvailable = (providerName) => providerName in providers;