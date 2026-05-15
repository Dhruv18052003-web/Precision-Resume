# Precision Resume

An AI-powered ATS resume optimization tool that refines your resume to match specific job descriptions, maximizing your chances of passing Applicant Tracking Systems.

## Features

- **PDF Resume Upload** — Drag-and-drop or click-to-upload with client-side text extraction
- **Job-Specific Optimization** — Tailors your resume to a target job title, description, company, and experience level
- **AI-Powered Refinement** — Uses Groq LLM to rewrite your resume with ATS-friendly formatting, keyword alignment, and professional structure
- **Live Preview** — Instantly preview the refined resume rendered as Markdown
- **Export Options** — Download the optimized resume as PDF or DOCX

## Tech Stack

### Frontend
- Next.js 14 (React 18)
- Tailwind CSS
- pdfjs-dist — client-side PDF text extraction
- react-markdown — rendered preview of refined output

### Backend
- Python / Flask
- Groq API (LLaMA LLM)
- ReportLab — PDF generation
- python-docx — DOCX generation

## Project Structure

```
Precision-Resume/
├── front-end/
│   └── app/
│       ├── page.jsx          # Main UI (input form + output preview)
│       ├── layout.jsx
│       └── globals.css
├── backend/
│   ├── app.py                # Flask application factory
│   └── src/
│       ├── controllers/
│       │   ├── refine_controller.py    # POST /api/refine-resume
│       │   └── download_controller.py  # POST /api/download-pdf, /api/download-docx
│       ├── services/
│       │   ├── groq_service.py         # LLM prompt engineering & API call
│       │   ├── pdf_service.py
│       │   └── docx_service.py
│       └── utils/
│           ├── resume_cleaner.py       # Text normalization
│           └── response_builder.py     # Standardized JSON responses
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- A [Groq API key](https://console.groq.com/)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install flask flask-cors groq reportlab python-docx markdown
```

Create `backend/instance/config.py`:

```python
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    GROQ_MODEL = os.getenv("GROQ_MODEL", "llama3-70b-8192")
```

Create a `.env` file in the `backend/` directory:

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama3-70b-8192
```

Run the server:

```bash
python app.py
```

The backend runs at `http://localhost:5000`.

### Frontend Setup

```bash
cd front-end
npm install
npm run dev
```

The frontend runs at `http://localhost:3000`.

## Usage

1. Open `http://localhost:3000` in your browser
2. Fill in the job details — title, description, experience level, employment type, company name and location
3. Upload your current resume as a PDF
4. Optionally add extra information (certifications, courses, achievements not in your resume)
5. Click **Modify Resume**
6. Review the AI-refined output in the preview panel
7. Download as PDF or DOCX

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/refine-resume` | Accepts resume text + job details, returns refined resume |
| POST | `/api/download-pdf` | Accepts refined resume text, returns PDF file |
| POST | `/api/download-docx` | Accepts refined resume text, returns DOCX file |

## 👨‍💻 Developer

**Dhruv Umang Joshi**

* Python AI Developer
* MSc in Computer Science (Artificial Intelligence Track) @ University of Pisa (Fall 2026)
* LinkedIn: https://linkedin.com/in/dhruv-joshi-aa8195241
* GitHub: https://github.com/Dhruv18052003-web
