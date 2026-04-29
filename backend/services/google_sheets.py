import os
import json
import logging
from datetime import datetime
import gspread
from google.oauth2.service_account import Credentials

logger = logging.getLogger(__name__)

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
]


def _get_credentials() -> Credentials:
    """
    Load Google service account credentials from the environment variable.
    GOOGLE_SERVICE_ACCOUNT_JSON must be a single-line JSON string.
    """
    raw_json = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON")
    if not raw_json:
        raise EnvironmentError(
            "GOOGLE_SERVICE_ACCOUNT_JSON environment variable is not set. "
            "Set it to the single-line JSON string of your service account credentials."
        )

    try:
        service_account_info = json.loads(raw_json)
    except json.JSONDecodeError as e:
        raise ValueError(
            f"GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON: {e}. "
            "Ensure it is a properly encoded single-line JSON string."
        )

    credentials = Credentials.from_service_account_info(
        service_account_info,
        scopes=SCOPES
    )
    return credentials


def _get_sheet():
    """
    Authenticate with Google Sheets and return the target worksheet.
    Uses GOOGLE_SHEET_ID from environment variables.
    """
    sheet_id = os.getenv("GOOGLE_SHEET_ID")
    if not sheet_id:
        raise EnvironmentError(
            "GOOGLE_SHEET_ID environment variable is not set."
        )

    credentials = _get_credentials()
    client = gspread.authorize(credentials)

    try:
        spreadsheet = client.open_by_key(sheet_id)
    except gspread.exceptions.SpreadsheetNotFound:
        raise ValueError(
            f"Google Sheet with ID '{sheet_id}' not found. "
            "Make sure the sheet exists and is shared with the service account email."
        )

    # Use first sheet or create 'Contacts' sheet if it doesn't exist
    try:
        worksheet = spreadsheet.worksheet("Contacts")
    except gspread.exceptions.WorksheetNotFound:
        logger.info("'Contacts' worksheet not found, creating it...")
        worksheet = spreadsheet.add_worksheet(title="Contacts", rows=1000, cols=6)
        # Add header row
        worksheet.append_row(
            ["Timestamp", "Name", "Phone", "Email", "Message"],
            value_input_option="USER_ENTERED"
        )
        logger.info("Created 'Contacts' worksheet with headers.")

    return worksheet


def append_contact_to_sheet(name: str, phone: str, email: str, message: str) -> None:
    """
    Append a new contact form submission as a row in Google Sheets.

    Args:
        name: Contact's full name
        phone: Contact's phone number
        email: Contact's email address
        message: Message from the contact

    Raises:
        EnvironmentError: If required environment variables are missing
        ValueError: If credentials JSON is invalid or sheet not found
        gspread.exceptions.APIError: If Google Sheets API call fails
    """
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    worksheet = _get_sheet()

    row = [timestamp, name, phone, email, message]

    worksheet.append_row(row, value_input_option="USER_ENTERED")
    logger.info(f"Successfully appended contact row for {email} at {timestamp}")
