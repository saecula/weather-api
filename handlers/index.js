const getCurrentWeather = (req, res) => {
    console.log('hi hello current')
    res.json({ location: 'San Francisco', temperature: '15°C', condition: 'Cloudy' });
}

const getForecast = (req, res) => {
    console.log('hi hello forecast')
    res.json({
        location: 'San Francisco',
        forecast: [
            { day: 'Monday', high: '18°C', low: '12°C', condition: 'Sunny' },
            { day: 'Tuesday', high: '17°C', low: '11°C', condition: 'Partly Cloudy' },
            { day: 'Wednesday', high: '16°C', low: '10°C', condition: 'Rain' },
        ]
    });
}

export default {
    getCurrentWeather,
    getForecast
};
