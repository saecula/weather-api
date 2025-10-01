import express from 'express';
import handlers from './handlers/index.js';

const router = express.Router();
router.get('/current', handlers.getCurrentWeather);
router.get('/forecast', handlers.getForecast);

export default router;