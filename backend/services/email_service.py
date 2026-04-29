import os
import smtplib
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

logger = logging.getLogger(__name__)


def send_contact_email(name: str, phone: str, email: str, message: str) -> None:
    """
    Send an email notification when a new contact form is submitted.

    Args:
        name: Contact's full name
        phone: Contact's phone number
        email: Contact's email address
        message: Message from the contact

    Raises:
        EnvironmentError: If EMAIL_* environment variables are not set
        smtplib.SMTPException: If email sending fails
    """
    email_host = os.getenv("EMAIL_HOST", "smtp.gmail.com")
    email_port = int(os.getenv("EMAIL_PORT", "587"))
    email_user = os.getenv("EMAIL_USER")
    email_pass = os.getenv("EMAIL_PASS")

    if not email_user or not email_pass:
        raise EnvironmentError(
            "EMAIL_USER and EMAIL_PASS environment variables must be set to send notifications."
        )

    subject = f"New Contact Form Submission from {name}"

    html_body = f"""
    <html>
    <body style="font-family: Georgia, serif; color: #2d4a1e; background: #f8f5ef; padding: 32px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
        <div style="background: linear-gradient(135deg, #2d4a1e 0%, #4a7c2f 100%); padding: 32px; text-align: center;">
          <h1 style="color: #c8e6a0; margin: 0; font-size: 24px; letter-spacing: 2px;">NEW CONTACT</h1>
          <p style="color: #a0c878; margin: 8px 0 0; font-size: 14px;">AgroSeeds Website Inquiry</p>
        </div>
        <div style="padding: 32px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e8f0dc; font-weight: bold; color: #4a7c2f; width: 100px;">Name</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e8f0dc; color: #333;">{name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e8f0dc; font-weight: bold; color: #4a7c2f;">Phone</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e8f0dc; color: #333;">{phone}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e8f0dc; font-weight: bold; color: #4a7c2f;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e8f0dc; color: #333;"><a href="mailto:{email}" style="color: #4a7c2f;">{email}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px 0; font-weight: bold; color: #4a7c2f; vertical-align: top;">Message</td>
              <td style="padding: 12px 0; color: #333; line-height: 1.6;">{message}</td>
            </tr>
          </table>
        </div>
        <div style="background: #f0f7e8; padding: 16px 32px; text-align: center;">
          <p style="color: #4a7c2f; font-size: 12px; margin: 0;">This message was submitted via the AgroSeeds contact form</p>
        </div>
      </div>
    </body>
    </html>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = email_user
    msg["To"] = email_user  # Send notification to yourself
    msg["Reply-To"] = email

    msg.attach(MIMEText(html_body, "html"))

    with smtplib.SMTP(email_host, email_port) as server:
        server.ehlo()
        server.starttls()
        server.login(email_user, email_pass)
        server.sendmail(email_user, email_user, msg.as_string())

    logger.info(f"Email notification sent for contact from {email}")
