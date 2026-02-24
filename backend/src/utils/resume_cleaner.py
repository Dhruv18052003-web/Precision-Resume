# backend/src/utils/resume_cleaner.py

import re

def clean_resume_text(text: str) -> str:
    """
    Clean and normalize resume text before sending to LLM.
    """

    if not text:
        return ""

    # Remove excessive spaces
    text = re.sub(r"[ \t]+", " ", text)

    # Normalize multiple newlines to max two
    text = re.sub(r"\n{3,}", "\n\n", text)

    # Remove weird bullet characters from PDFs
    text = text.replace("•", "-")

    # Strip leading/trailing whitespace
    text = text.strip()

    return text
