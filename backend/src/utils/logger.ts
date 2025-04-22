type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogMessage {
  level: LogLevel;
  message: string;
  timestamp: string;
  [key: string]: any;
}

class Logger {
  private formatMessage(level: LogLevel, message: string, meta?: any): LogMessage {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...meta,
    };
  }

  info(message: string, meta?: any) {
    const logMessage = this.formatMessage('info', message, meta);
    console.log(JSON.stringify(logMessage));
  }

  warn(message: string, meta?: any) {
    const logMessage = this.formatMessage('warn', message, meta);
    console.warn(JSON.stringify(logMessage));
  }

  error(message: string, meta?: any) {
    const logMessage = this.formatMessage('error', message, meta);
    console.error(JSON.stringify(logMessage));
  }

  debug(message: string, meta?: any) {
    if (process.env.NODE_ENV === 'development') {
      const logMessage = this.formatMessage('debug', message, meta);
      console.debug(JSON.stringify(logMessage));
    }
  }
}

export const logger = new Logger(); 