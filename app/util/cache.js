import NodeCache from 'node-cache';
import { config } from '../config.js';

const cache = new NodeCache({ stdTTL: config.cache.ttlSeconds });

export default cache;
