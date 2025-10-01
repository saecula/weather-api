import express from 'express';
import { rateLimit } from 'express-rate-limit';

import routes from './routes.js';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
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
