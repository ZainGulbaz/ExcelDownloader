import { createLogger, format, transports } from "winston";

// Ignore log messages if they have { private: true }
const ignorePrivate = format((info, opts) => {
  if (info.private) {
    return false;
  }
  return info;
});

const logger = createLogger({
  format: format.combine(format.simple(), format.colorize({ all: true })),
  transports: [new transports.Console()],
});

export default logger;
