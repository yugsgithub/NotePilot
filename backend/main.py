from time import time
import uuid
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import FileResponse
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from fastapi.responses import FileResponse
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)
from reportlab.lib.styles import getSampleStyleSheet


import sys
import os
import shutil



CURRENT_FILE = None
CURRENT_CHUNKS = 0

TOTAL_QUESTIONS = 0
TOTAL_UPLOADS = 0 

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RAG_DIR = os.path.join(BASE_DIR, "rag-service", "src")

sys.path.append(RAG_DIR)


from rag_chatbot import (
    ask_question,
    load_pdf,
    generate_quiz_json,
    generate_flashcards,
    ALL_FILES,
    search_notes,
    generate_study_notes,
    predict_exam_questions,
    reset_conversation,
    clear_all_data
)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
        "https://notepilot-frontend.onrender.com"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DocumentRequest(BaseModel):
    path: str

class QuestionRequest(BaseModel):
    question: str

class SearchRequest(BaseModel):
    query: str

class OralExamRequest(BaseModel):
    answer: str


@app.get("/")
def home():
    return {
        "message": "NotePilot Backend Running"
    }

@app.get("/quiz")
def quiz():
    return generate_quiz_json()


@app.get("/flashcards")
def flashcards():

    return generate_flashcards()


@app.post("/ask")
def ask(data: QuestionRequest):
    global TOTAL_QUESTIONS
    TOTAL_QUESTIONS += 1
    result = ask_question(
        data.question
    )

    return result


@app.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...)
):
    global TOTAL_UPLOADS
    TOTAL_UPLOADS += 1

    # Validate file type
    if not file.filename.endswith(".pdf"):
        return {
            "message": "Only PDF files are allowed"
        }

    upload_dir = os.path.abspath(
        "../rag-service/uploads"
    )

    os.makedirs(
        upload_dir,
        exist_ok=True
    )

    unique_name = f"{uuid.uuid4()}.pdf"

    file_path = os.path.join(
    upload_dir,
    file.filename
)

    with open(
        file_path,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    print("Saved file:", file_path)
    print("File size:", os.path.getsize(file_path))

    chunk_count = load_pdf(file_path)

    global CURRENT_FILE
    global CURRENT_CHUNKS
    

    CURRENT_FILE = file.filename
    CURRENT_CHUNKS = chunk_count

    print("ALL_FILES:", ALL_FILES)


    return {
        "message": "PDF uploaded successfully"
    }


@app.get("/document-info")
def document_info():

    return {
        "filename": CURRENT_FILE,
        "chunks": CURRENT_CHUNKS
    }

@app.get("/analytics")
def analytics():

    return {
        "uploads": TOTAL_UPLOADS,
        "questions": TOTAL_QUESTIONS,
        "chunks": CURRENT_CHUNKS,
        "current_file": CURRENT_FILE
    }

@app.post("/generate-quiz")
def generate_new_quiz():

    import rag_chatbot


    rag_chatbot.QUIZ_CACHE = None

    return generate_quiz_json()


@app.get("/quiz/regenerate")
def regenerate_quiz():

    import rag_chatbot

    rag_chatbot.QUIZ_CACHE = None

    return generate_quiz_json()


@app.get("/flashcards/regenerate")
def regenerate_flashcards():

    import rag_chatbot

    rag_chatbot.FLASHCARD_CACHE = None

    return {
        "flashcards": generate_flashcards()
    }

@app.get("/summary")
def get_summary():

    from rag_chatbot import generate_summary

    return {
        "summary": generate_summary()
    }

@app.get("/study-notes")
def get_study_notes():
    return {
        "notes": generate_study_notes()
    }

@app.get("/revision")
def revision():

    questions = generate_quiz_json()

    return questions[:5]


@app.get("/documents")
def documents():

    from rag_chatbot import ALL_FILES

    print("DOCUMENT ENDPOINT:")
    print(ALL_FILES)

    return ALL_FILES


@app.post("/documents/load")
def load_document(
data: DocumentRequest
):

    chunk_count = load_pdf(
    data.path
)

    global CURRENT_FILE
    global CURRENT_CHUNKS

    CURRENT_FILE = os.path.basename(
    data.path
)

    CURRENT_CHUNKS = chunk_count

    return {
    "message":
        f"{CURRENT_FILE} loaded successfully",
    "chunks":
        CURRENT_CHUNKS
}




@app.get("/export-summary")
def export_summary():

    from rag_chatbot import SUMMARY_CACHE

    if not SUMMARY_CACHE:
        return {
            "message": "No summary available"
        }

    pdf_path = "study_notes.pdf"

    doc = SimpleDocTemplate(pdf_path)

    styles = getSampleStyleSheet()

    content = [
        Paragraph(
            "NotePilot Study Notes",
            styles["Title"]
        )
    ]

    for line in SUMMARY_CACHE.split("\n"):
        content.append(
            Paragraph(
                line,
                styles["BodyText"]
            )
        )

    doc.build(content)

    return FileResponse(
        pdf_path,
        filename="StudyNotes.pdf",
        media_type="application/pdf"
    )


@app.delete("/documents/{doc_name}")
def delete_document(doc_name: str):

    global CURRENT_FILE
    global CURRENT_CHUNKS

    upload_dir = os.path.abspath("../rag-service/uploads")

    file_path = os.path.join(upload_dir, doc_name)

    if os.path.exists(file_path):
        os.remove(file_path)

    CURRENT_FILE = None
    CURRENT_CHUNKS = 0

    clear_all_data()

    reset_conversation()

    return {
        "message": "Document deleted"
    }


@app.post("/search")
def search(data: SearchRequest):

    results = search_notes(
        data.query
    )

    return results

@app.get("/export-notes")
def export_notes():

    from rag_chatbot import SUMMARY_CACHE

    pdf_file = "study_notes.pdf"

    doc = SimpleDocTemplate(pdf_file)

    styles = getSampleStyleSheet()

    content = []

    content.append(
        Paragraph(
            "NotePilot Study Notes",
            styles["Title"]
        )
    )

    content.append(
        Spacer(1, 20)
    )

    content.append(
        Paragraph(
            SUMMARY_CACHE,
            styles["BodyText"]
        )
    )

    doc.build(content)

    return FileResponse(
        pdf_file,
        filename="study_notes.pdf",
        media_type="application/pdf"
    )


@app.get("/achievements")
def achievements():

    return {
        "uploads": TOTAL_UPLOADS,
        "questions": TOTAL_QUESTIONS
    }

@app.get("/exam-predictor")
def exam_predictor():

    return {
        "questions":
        predict_exam_questions()
    }

@app.get("/documents/count")
def documents_count():
    return {
        "count": len(ALL_FILES)
    }



@app.get("/status")
def status():

    from rag_chatbot import ALL_FILES

    return {
        "hasDocuments": len(ALL_FILES) > 0,
        "documents": len(ALL_FILES),
        "currentFile": ALL_FILES[0]["name"] if ALL_FILES else None
    }



@app.get("/oral-exam/question")
def oral_exam_question():

    from rag_chatbot import ALL_CHUNKS
    from llm import chat

    if len(ALL_CHUNKS) == 0:
        return {
            "question": "No notes loaded.",
            "answer": ""
        }

    import random

    chunk = random.choice(ALL_CHUNKS)

    prompt = f"""
Create ONE oral viva question from these notes.

Notes:
{chunk}

Return EXACTLY in this format:

Question: <question>

Answer: <ideal answer>
"""

    text = chat(
    [
        {
            "role": "user",
            "content": prompt
        }
    ]
)
    question = ""
    answer = ""

    if "Answer:" in text:

        parts = text.split("Answer:")

        question = (
            parts[0]
            .replace("Question:", "")
            .strip()
        )

        answer = parts[1].strip()

    else:

        question = text.strip()

    return {
        "question": question,
        "answer": answer
    }



@app.post("/oral-exam/evaluate")
def oral_exam_evaluate(data: dict):

    from llm import chat
    user_answer = data.get("answer", "")
    correct_answer = data.get("correct_answer", "")

    prompt = f"""
Question answer key:
{correct_answer}

Student answer:
{user_answer}

Evaluate briefly.

Return:

Score: X/10

Strengths:
- ...

Improvements:
- ...

Keep the feedback under 150 words.
"""

    feedback = chat(
    [
        {
            "role": "user",
            "content": prompt
        }
    ]
)

    return {
        "feedback": feedback
    }




@app.post("/reset-chat")
def reset_chat():

    reset_conversation()

    return {
        "message": "Conversation reset successfully"
    }    