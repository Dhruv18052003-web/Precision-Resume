# backend/src/controllers/refine_controller.py

from flask import Blueprint, request, current_app
from src.services.groq_service import generate_refined_resume
from src.utils.resume_cleaner import clean_resume_text
from src.utils.response_builder import success_response, error_response

# Create a Blueprint for refine-related routes
refine_bp = Blueprint("refine", __name__)

@refine_bp.route("/refine-resume", methods=["POST"])
def refine_resume():
    """
    Handle resume refinement requests.
    """
    try:
        data = request.get_json()
        if not data:
            return error_response("Invalid JSON payload", 400)

        # Extract fields
        job_title = data.get("jobTitle", "")
        job_description = data.get("jobDescription", "")
        experience_level = data.get("experienceLevel", "")
        employment_type = data.get("employmentType", "")
        company_location = data.get("companyLocation", "")
        company_name = data.get("companyName", "")
        resume_text = data.get("resumeText", "")
        additional_info = data.get("additionalInfo", "")

        # Validate required fields
        if not job_title or not job_description or not resume_text:
            return error_response("Missing required fields", 400)

        # ✅ Clean text before sending to LLM
        cleaned_resume_text = clean_resume_text(resume_text)
        cleaned_additional_info = clean_resume_text(additional_info)

        # Call Groq service
        refined_resume = generate_refined_resume(
            job_title=job_title,
            job_description=job_description,
            experience_level=experience_level,
            employment_type=employment_type,
            company_location=company_location,
            company_name=company_name,
            resume_text=cleaned_resume_text,
            additional_info=cleaned_additional_info,
        )

        return success_response(
            {"refined_resume": refined_resume},
            200
        )

    except Exception as e:
        print("Error refining resume:", e)
        return error_response("Internal server error", 500)
