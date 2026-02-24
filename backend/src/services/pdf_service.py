# backend/src/services/pdf_service.py

from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch


def generate_pdf(refined_resume_text: str) -> BytesIO:
    """
    Generate a PDF file from refined resume text.
    Returns a BytesIO buffer containing the PDF.
    """

    # Create an in-memory bytes buffer
    buffer = BytesIO()

    # Create a PDF canvas
    pdf = canvas.Canvas(buffer, pagesize=A4)

    # Page settings
    width, height = A4
    x_margin = 1 * inch
    y_margin = 1 * inch

    # Starting cursor position (top-left style)
    x_position = x_margin
    y_position = height - y_margin

    # Font settings (ATS-safe)
    pdf.setFont("Helvetica", 10)

    # Line spacing
    line_height = 14

    # Split text into lines
    lines = refined_resume_text.split("\n")

    for line in lines:
        # Create a new page if space is finished
        if y_position <= y_margin:
            pdf.showPage()
            pdf.setFont("Helvetica", 10)
            y_position = height - y_margin

        pdf.drawString(x_position, y_position, line)
        y_position -= line_height

    # Finalize the PDF
    pdf.save()

    # Move cursor back to start of buffer
    buffer.seek(0)

    return buffer
