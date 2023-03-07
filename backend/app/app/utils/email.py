import logging
from typing import Any, Dict

import emails
from emails.template import JinjaTemplate

from app.core.config import settings


def send_email(to: str, subject: str = "", content: str = "", env: Dict[str, Any] = {}):
    assert settings.EMAILS_ENABLED, "No provided configuration for Email"
    message = emails.Message(
        subject=JinjaTemplate(subject),
        html=JinjaTemplate(content),
        mail_from=(settings.FROM_NAME, settings.FROM_EMAIL),
    )
    smtp_options = {"host": settings.SMTP_HOST, "port": settings.SMTP_PORT}
    if settings.SMTP_TLS:
        smtp_options["tls"] = True
    if settings.SMTP_USER:
        smtp_options["user"] = settings.SMTP_USER
    if settings.SMTP_PASSWORD:
        smtp_options["password"] = settings.SMTP_PASSWORD

    response = message.send(to=to, render=env, smtp=smtp_options)
    logging.info(f"send email result: {response}")
