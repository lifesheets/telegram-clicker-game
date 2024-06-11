const { createLogger, format, transports } = require('winston');

module.exports = {
    logger: createLogger({
        level: 'info',
        format: format.combine(
            format.timestamp(),
            format.json()
        ),
        transports: [
            new transports.Console(),
            new transports.File({ filename: './tmp/logs/default.log' })
        ]
    })
};
