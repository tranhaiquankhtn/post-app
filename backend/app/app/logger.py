import re
from logging import LogRecord, handlers


class NoColoredRotatingFileHandler(handlers.TimedRotatingFileHandler):

    def format(self, record: LogRecord):
        log_str = super().format(record)
        log_str = re.sub(r"(\x9B|\x1B\[)[0-?]*[ -\/]*[@-~]", "", log_str)
        return log_str


def config_logging(outfile_path: str) -> dict:
    return {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "default": {
                "()": "uvicorn.logging.DefaultFormatter",
                "format": "[%(asctime)s][%(name)s] - %(levelprefix)s %(message)s",
            },
            "access": {
                "()": "uvicorn.logging.AccessFormatter",
                "format": '[%(asctime)s][%(name)s] - %(levelprefix)s - "%(request_line)s" %(status_code)s',
            },
        },
        "handlers": {
            "default": {
                "formatter": "default",
                "class": "logging.StreamHandler",
                "stream": "ext://sys.stderr",
            },
            "access": {
                "formatter": "access",
                "class": "logging.StreamHandler",
                "stream": "ext://sys.stdout",
            },
            "info_file_handler": {
                "class": "app.logger.NoColoredRotatingFileHandler",
                "level": "INFO",
                "formatter": "default",
                "filename": outfile_path,
                "backupCount": 10,
                "when": "midnight",
            },
            "error_file_handler": {
                "class": "app.logger.NoColoredRotatingFileHandler",
                "level": "ERROR",
                "formatter": "default",
                "filename": outfile_path,
                "backupCount": 10,
                "when": "midnight",
            },
        },
        "loggers": {
            "": {
                "handlers": ["default", "info_file_handler", "error_file_handler"],
                "level": "INFO",
                "propagate": False,
            },
            "uvicorn.error": {
                "level": "INFO",
                "handlers": ["access", "error_file_handler"],
                "propagate": False,
            },
            "uvicorn.access": {
                "handlers": ["access", "info_file_handler"],
                "level": "INFO",
                "propagate": False,
            },
        },
    }
