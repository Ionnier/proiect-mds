require('dotenv').config();

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION!');
    console.log(err);
    process.exit(1);
});

const app = require('./app');

const port = process.env.PORT || 3000;

if (process.env.DATABASE_URL.includes('localhost')) {
    process.env.HOSTNAME = `localhost:${port}`
    process.env.PROTOCOL = 'http'
}

const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION!');
    console.log(err);
    server.close(() => {
        process.exit(1);
    });
});

process.on('SIGTERM', () => {
    console.log('SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
        console.log('Process terminated!');
    });
});