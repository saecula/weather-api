import app from './app.js';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

const shutdown = (signal) => {
    console.log(`Received ${signal}. Closing server...`);
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
    setTimeout(() => {
        console.error('Forcing shutdown');
        process.exit(1);
    }, 10000).unref();
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

export default server;
