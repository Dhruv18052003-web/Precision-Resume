import markdown
from pathlib import Path

TEMPLATE_PATH = Path(__file__).parent.parent / "utils" / "templates" / "resume.html"

def render_resume_html(markdown_text: str) -> str:
    """
    Converts resume Markdown to styled HTML using a template.
    """

    # 1) Convert Markdown → HTML
    resume_html = markdown.markdown(
        markdown_text,
        extensions=["extra"]
    )

    # 2) Load HTML template
    template = TEMPLATE_PATH.read_text(encoding="utf-8")

    # 3) Inject resume content
    final_html = template.replace("{{ resume_content }}", resume_html)

    return final_html
