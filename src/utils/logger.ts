/* 
Include basic local logging of:
    Service provider
    Time of sending
    Data sent (rows and columns)
    Success or failure
    Error message if applicable
 */

import pino from "pino";
import { config } from "../config/index.js";


// Define the transport configuration only when the output stream is connected to a terminal (TTY)
const transport = process.stdout.isTTY ?
    {transport: 
            {
                target: "pino-pretty",
                options: {
                    colorize: true,
                    translateTime: 'SYS:standard',
                    ignore: "pid,hostname"
                }
            }
    } : {};

export const logger = pino({
    level: config.LOG_LEVEL,
    timestamp: pino.stdTimeFunctions.isoTime,
    ...transport
});


/* 

Example child logger:

export const githubLogger = logger.child({
    serviceProvider: "Github",
})

//Later:
// On success:
log.info({
    dataSent: {
        rows: records.length,
        columns: records.length > 0 ? Object.keys(records[0]).length : 0
    },
    success: true,
}, 'Sync complete');

// On failure:
log.error({
    dataSent: {
        rows: 0,
        columns: 0
    },
    success: false,
    errorMessage: error.message,
}, 'Sync failed'); 

*/