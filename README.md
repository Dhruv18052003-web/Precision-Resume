# Smart AI Logbook: Multi-Agent Expense Tracker 📊🤖

A chat-based personal finance and expense tracking system powered by a **Multi-Agentic Architecture**. This project abstracts away the complexity of traditional accounting databases by allowing users to log, categorize, and query their financial data using pure natural language.

## 🧠 Architecture & Multi-Agent Design
Instead of relying on a single prompt, this system decomposes complex financial tasks into specialized agents:
* **Parsing Agent:** Extracts numerical values, dates, and vendors from unstructured conversational input.
* **Categorization Agent:** Uses LLM-based zero-shot classification to accurately assign expenses to logical buckets (e.g., "Food", "Transport", "Utilities") with high accuracy.
* **Database Routing Agent:** Formats the structured JSON payload and executes the database insertion without manual data entry.

## 🛠️ Tech Stack
* **Language:** Python
* **AI/LLM Orchestration:** [Insert LangChain, OpenAI, or specific framework used]
* **Database:** [Insert SQLite, PostgreSQL, or vector DB if used]
* **UI/Interface:** [Insert Streamlit, Flask template, or CLI if applicable]

## 🚀 Quick Start

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Dhruv18052003-web/spend-sense-AI-logbook.git](https://github.com/Dhruv18052003-web/spend-sense-AI-logbook.git)
   cd spend-sense-AI-logbook

```

2. **Set up virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

```


3. **Install dependencies:**
```bash
pip install -r requirements.txt

```


4. **Environment Variables:**
Create a `.env` file and add necessary keys:
```env
LLM_API_KEY=your_key_here

```


5. **Run the application:**
```bash
python app.py  # (Adjust command based on your entry point)

```


## 👨‍💻 Developer

**Dhruv Umang Joshi**

* AI Backend Developer & Incoming MSc AI @ University of Pisa
* [LinkedIn](Insert Link)
