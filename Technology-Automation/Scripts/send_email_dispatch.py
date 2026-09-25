#!/usr/bin/env python3
"""
Email Dispatch Script for TravelFrame
Sends formatted reports and content packages via SMTP.
"""

import os
import sys
import smtplib
from pathlib import Path
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def load_env():
    env_file = Path(".env")
    if not env_file.exists():
        return
    with open(env_file, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            k = k.strip()
            v = v.strip().strip("'\"")
            if k not in os.environ:
                os.environ[k] = v


def main():
    load_env()
    recipient = sys.argv[1] if len(sys.argv) > 1 else "sonbui20020112@gmail.com"
    content_file = Path("Marketing-Growth/Content/Drafts/Email-Dispatch-sonbui20020112.md")

    if not content_file.exists():
        print(f"Error: {content_file} not found.")
        sys.exit(1)

    body = content_file.read_text(encoding="utf-8")

    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))

    if not smtp_user or not smtp_pass:
        print("Notice: SMTP credentials (SMTP_USER, SMTP_PASS) not found in .env.")
        print(f"The complete email package is saved and ready at: {content_file}")
        print("To send automatically via Gmail SMTP, add SMTP_USER and SMTP_PASS (App Password) to .env and re-run.")
        sys.exit(0)

    msg = MIMEMultipart()
    msg["From"] = smtp_user
    msg["To"] = recipient
    msg["Subject"] = "TravelFrame: Ket qua nghien cuu tu khoa va bai viet SEO (2026)"
    msg.attach(MIMEText(body, "plain", "utf-8"))

    try:
        print(f"Connecting to {smtp_host}:{smtp_port}...")
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)
        print(f"Email successfully sent to {recipient}!")
    except Exception as e:
        print(f"Error sending email: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
