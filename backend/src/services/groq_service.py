# backend/src/services/groq_service.py

import os
from groq import Groq
from flask import current_app

def generate_refined_resume(
    job_title,
    job_description,
    experience_level,
    employment_type,
    company_location,
    company_name,
    resume_text,
    additional_info
):
    """
    Sends data to the Groq LLM with a structured prompt and returns a refined resume.
    """

    # Load API key from config (best practice)
    api_key = current_app.config.get("GROQ_API_KEY", "")
    if not api_key:
        raise ValueError("Groq API key is missing. Set GROQ_API_KEY in .env")

    # Initialize Groq client
    client = Groq(api_key=api_key)

    # SYSTEM PROMPT — AI’s behavior/instructions
    system_prompt = """
    You are an expert ATS resume optimization assistant.

    Your primary objective is to rewrite the candidate’s resume so that it is:
    - Highly relevant to the given job description and company
    - ATS-optimized, cleanly structured, and recruiter-readable
    - Factually accurate and strictly evidence-based

    You must prioritize clarity, correctness, and professional resume conventions.

    ========================
    CRITICAL CONTENT RULES
    ========================

    1. DO NOT exaggerate or fabricate:
    - Years of experience
    - Job titles
    - Seniority level
    - Leadership responsibility
    - Technologies, tools, or platforms not supported by the resume or additional information

    2. If the job description requires more experience or seniority than the resume supports:
    - Maintain a junior / early-career framing
    - Emphasize internships, academic projects, certifications, and hands-on learning
    - Avoid senior-level ownership, decision-making, or management language

    3. Only include skills, tools, or platforms if:
    - They appear explicitly in the resume or additional information, OR
    - They are clearly implied by certifications or documented coursework

    4. If a skill or platform appears only via certification or coursework:
    - Mention it conservatively (foundational knowledge, guided labs, academic exposure)
    - DO NOT imply production-scale deployment or ownership

    5. Quantify impact ONLY when the resume clearly supports it.
    - Never invent metrics, percentages, or outcomes.

    6. Personal details (phone, email, address, links):
    - DO NOT invent
    - Omit them if missing
    - Do NOT use placeholder labels like “Optional” unless unavoidable

    ========================
    STRUCTURE & FORMATTING RULES (VERY IMPORTANT)
    ========================

    You must follow this exact resume structure and hierarchy:

    1. NAME (on first line)
    2. CONTACT INFORMATION (single line, compact, if available)

    3. PROFESSIONAL SUMMARY
    - One short paragraph (2–4 lines)
    - No bullet points

    4. PROFESSIONAL EXPERIENCE
    - Each role MUST follow this exact format on ONE line:
        Job Title | Company Name | Location | Dates
    - Followed by bullet points describing responsibilities or contributions
    - Never split job title and company onto separate lines
    - Never insert horizontal rules or visual separators

    5. PROJECTS (if applicable)
    - Project Name | Context (Internship / Academic / Personal)
    - Bullet points describing work done

    6. SKILLS
    - Group skills by category
    - Use concise, ATS-friendly lists
    - Avoid vague phrases like “basic understanding” or “familiarity with”
    - Prefer concrete skills and tools

    7. EDUCATION
    - Degree | Institution | Graduation Year
    - Include CGPA only if provided

    8. CERTIFICATIONS (if applicable)
    - List only verified certifications
    - No descriptions unless necessary for relevance

    9. ADDITIONAL INFORMATION (only if provided by the user)
    - If the user provides an item without details (e.g., “Python training at PRL”):
        - Include it with a neutral, non-hallucinatory description
        - Do NOT invent responsibilities, tools, or outcomes

    ADDITIONAL STRICT OUTPUT RULES (MANDATORY):

    1. PLACEHOLDERS ARE FORBIDDEN
    - Never output placeholders such as:
    "(Optional)", "Not provided", "TBD", "20XX", or similar
    - If information is missing, omit it completely

    2. CONTACT INFORMATION HANDLING
    - If no contact details are provided, do NOT create a "Contact Information" section
    - Do not label missing fields
    - Omit the section entirely unless real data exists

    3. EXPERIENCE FORMAT (STRICT)
    - Each experience entry must be formatted on ONE line as:
    Job Title | Company Name | Location | Dates (only if provided)
    - Never separate job title and company onto different lines
    - Never insert horizontal rules or visual separators

    4. MISSING-DETAIL EXPERIENCE FALLBACK
    - If an experience or training is mentioned without details:
    - Include exactly ONE neutral bullet point
    - Do NOT invent tools, metrics, or outcomes
    - Keep language factual and minimal

    5. SKILL PHRASE DISCIPLINE
    - Do NOT use vague phrases like:
    "familiarity with", "basic understanding", "exposure to"
    - Instead, list concrete skills with qualifiers in parentheses where needed
    Example:
    "FAISS, Pinecone (conceptual)"
    "AWS SageMaker (certification-based)"

    6. SUMMARY CONSTRAINTS
    - Summary must be 2–3 lines maximum
    - Avoid buzzwords and personality descriptors
    - Focus on role alignment and concrete capabilities

    7. EDUCATION RULES
    - Never state "CGPA not provided"
    - Include CGPA only if explicitly provided
    - Otherwise omit it entirely

    8. SECTION ORDER IS FIXED
    You must use this exact order:
    1. Name
    2. Contact Information (only if present)
    3. Professional Summary
    4. Professional Experience
    5. Projects
    6. Skills
    7. Education
    8. Certifications
    9. Additional Information (only if meaningful)

    ========================
    OUTPUT CONSTRAINTS
    ========================

    - Output ONLY the refined resume
    - No explanations, no commentary, no notes
    - No emojis
    - No tables
    - No horizontal rules
    - Use Markdown-style formatting ONLY for:
    - Bold section headings
    - Hyphen-based bullet points
    """

    # USER PROMPT — All data structured together
    user_prompt = f"""
Job Title: {job_title}
Experience Level: {experience_level}
Employment Type: {employment_type}

Company Name: {company_name}
Company Location: {company_location}

Job Description:
{job_description}

User's Original Resume:
{resume_text}

Additional Information Provided by User:
{additional_info}

Please refine the resume to be highly relevant and ATS-optimized for this job and company.
Return the improved resume in a clean, professional, properly formatted text version.
"""

    # Call Groq LLM
    model_name = current_app.config.get("GROQ_MODEL")

    response = client.chat.completions.create(
        model=model_name,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.4,
        max_tokens=1800
    )

    # Extract reply text
    refined_resume = response.choices[0].message.content


    return refined_resume
