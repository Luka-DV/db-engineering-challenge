/* 
Include basic local logging of:
    Service provider
    Time of sending
    Data sent (rows and columns)
    Success or failure
    Error message if applicable
 */

import pino from "pino";

export const logger = pino({
    level: "info",
    timestamp: pino.stdTimeFunctions.isoTime,
    transport: process.env.NODE_ENV !== "production" ?
    {
        target: "pino-pretty",
        options: {
            destination: process.stdout.fd,
        }
    } : undefined
});


export const githubLogger = logger.child({
    serviceProvider: "Github",
})


//Later:
/* 
// On success:
log.info({
  rows: records.length,
  columns: records.length > 0 ? Object.keys(records[0]).length : 0,
  success: true,
}, 'Sync complete');

// On failure:
log.error({
  rows: 0,
  columns: 0,
  success: false,
  errorMessage: error.message,
}, 'Sync failed'); 
*/