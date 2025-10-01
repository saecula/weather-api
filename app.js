import express from 'express';
import { rateLimit } from 'express-rate-limit';
import dotenv from 'dotenv';

import routes from './routes.js';

dotenv.config();

const limiter = rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW_MS ? parseInt(process.env.RATE_LIMIT_WINDOW_MS) : 15 * 60 * 1000,
    max: process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX) : 100,
});

const app = express();

app.use(express.json());

app.use(limiter);

app.use('/api/v1', routes);

app.get('/', (req, res) => {
    res.json({ ok: true, message: 'Hello from Weather API', uptime: process.uptime() });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
});

export default app;
