const { createLogger, format, transports } = require('winston');
const debug = require('debug');

module.exports = {
    logger: createLogger({
        level: 'info',
        format: format.combine(format.timestamp(), format.json()),
        transports: [
            new transports.Console(),
            new transports.File({ filename: './tmp/logs/output.log' })
        ]
    }),
    createDebug: (namespace) => {
        return debug(namespace);
    }
};
