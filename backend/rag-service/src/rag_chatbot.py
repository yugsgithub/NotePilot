import json
import os
import random
from pypdf import PdfReader
import numpy as np
from groq import Groq
from dotenv import load_dotenv
import os
from llm import chat

load_dotenv("../.env")

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

index = None
model = None
conversation_history = []

ALL_CHUNKS = []
ALL_FILES = []

FLASHCARD_CACHE = None
QUIZ_CACHE = None
SUMMARY_CACHE = None

CHAT_MODEL = "llama-3.3-70b-versatile"
FLASHCARD_MODEL = "llama-3.1-8b-instant"
QUIZ_MODEL = "llama-3.3-70b-versatile"

print("RAG MODULE:", __file__)
print("RAG MODULE ID:", id(globals()))


def clear_all_data():

    global index
    global ALL_CHUNKS
    global ALL_FILES

    global FLASHCARD_CACHE
    global QUIZ_CACHE
    global SUMMARY_CACHE

    global conversation_history

    index = None

    ALL_CHUNKS.clear()
    ALL_FILES.clear()

    FLASHCARD_CACHE = None
    QUIZ_CACHE = None
    SUMMARY_CACHE = None

    conversation_history.clear()




def groq_chat(messages, model="llama-3.3-70b-versatile"):

    response = client.chat.completions.create(

        model=model,

        messages=messages,

        temperature=0.3,

        max_completion_tokens=1200

    )

    return response.choices[0].message.content



def chat_llm(prompt):
    return groq_chat(
        [
            {
                "role": "user",
                "content": prompt
            }
        ],
        model=CHAT_MODEL
    )

    


def extract_text(pdf_path):
    reader = PdfReader(pdf_path)

    text = ""

    for page in reader.pages:
        page_text = page.extract_text()

        if page_text:
            text += page_text + "\n"

    return text


def chunk_text(text, chunk_size=400):
    result = []

    for i in range(0, len(text), chunk_size):
        result.append(text[i:i + chunk_size])

    return result


def load_pdf(pdf_path):

    global model
    global index

    global ALL_FILES
    global ALL_CHUNKS

    global FLASHCARD_CACHE
    global QUIZ_CACHE
    global SUMMARY_CACHE

    FLASHCARD_CACHE = None
    QUIZ_CACHE = None
    SUMMARY_CACHE = None

    print("LOAD_PDF MODULE ID:", id(globals()))

    print("\n===== LOADING PDF =====")
    print(pdf_path)
    

    if model is None:

        from sentence_transformers import SentenceTransformer

        print("\nLoading embedding model...")

        model = SentenceTransformer(
            "all-MiniLM-L6-v2"
        )

        print("Embedding model loaded.")

    pdf_text = extract_text(pdf_path)

    new_chunks = chunk_text(pdf_text)
    
    ALL_FILES.clear()

    ALL_FILES.append({
    "name": os.path.basename(pdf_path),
    "path": pdf_path,
    "chunks": len(new_chunks)
})
    
    print("ALL_FILES AFTER LOAD:")
    print(ALL_FILES)

    # IMPORTANT:
    # Replace old chunks instead of extending

    ALL_CHUNKS = new_chunks

    print(
        f"Created {len(new_chunks)} chunks"
    )

    print(
        "Generating embeddings..."
    )

    embeddings = model.encode(
        ALL_CHUNKS,
        convert_to_numpy=True
    )

    # IMPORTANT:
    # Rebuild FAISS from scratch
    import faiss

    index = faiss.IndexFlatL2(
        embeddings.shape[1]
    )

    index.add(
        embeddings.astype("float32")
    )

    print("RAG Ready!")

    return len(new_chunks)


def ask_question(query):

    global model
    global ALL_CHUNKS
    global index
    global conversation_history
    import faiss

    print("ASK MODULE ID:", id(globals()))
    print("INDEX IS NONE:", index is None)

    # Save user message
    conversation_history.append({
        "role": "user",
        "content": query
    })

    # Keep only last 10 messages
    conversation_history = conversation_history[-10:]

    # ---------------------------------
    # No PDF Uploaded
    # ---------------------------------

    if index is None:

        answer = groq_chat(
        conversation_history,
        model=CHAT_MODEL
    )

        conversation_history.append({
            "role": "assistant",
            "content": answer
        })

        return {
            "answer": answer,
            "sources": []
        }

    # ---------------------------------
    # RAG Search
    # ---------------------------------

    query_embedding = model.encode(
        [query],
        convert_to_numpy=True
    )

    distances, indices = index.search(
        query_embedding.astype("float32"),
        k=min(3, len(ALL_CHUNKS))
    )

    print("Best Distance:", distances[0][0])
    print("\n===== TOP CHUNKS =====")

    for idx in indices[0]:
        print(
        ALL_CHUNKS[idx][:300]
    )
    print("\n----------------\n")

    # ---------------------------------
    # Question NOT Related To PDF
    # ---------------------------------


    if distances[0][0] > 3:

        answer = groq_chat(
        conversation_history,
        model=CHAT_MODEL
    )

        conversation_history.append({
        "role": "assistant",
        "content": answer
    })

        return {
            "answer": answer,
            "sources": []
        }

    # ---------------------------------
    # Build Context
    # ---------------------------------

    context = "\n\n".join(
        ALL_CHUNKS[idx]
        for idx in indices[0]
    )

    prompt = f"""
You are NotePilot AI, an intelligent study assistant.

Your purpose is to help students understand their uploaded notes.

=====================================================
IMPORTANT RULES
=====================================================

1. The user HAS already uploaded a PDF.
2. The text below comes directly from that uploaded PDF.
3. Never tell the user:
   - "There is no uploaded PDF."
   - "Upload a PDF."
   - "I cannot find the PDF."

4. Use the uploaded notes as your PRIMARY source.

5. If the answer exists in the notes:
   - Explain it clearly.
   - Keep the language simple.
   - Elaborate when useful.
   - Use bullet points whenever appropriate.

6. If the answer is only partially present:
   - First explain what is available from the notes.
   - Then fill the missing gaps using your own knowledge.
   - Clearly separate the two.

7. If the answer is completely absent:
   Say:
   "This topic is not explicitly covered in your uploaded notes."
   Then teach the concept using your own knowledge.

8. Remember previous questions in this conversation.
If the user asks follow-up questions like:
- "Explain more"
- "Give an example"
- "Simplify it"
- "What about chapter 2?"
continue naturally instead of starting over.

9. Never invent facts from the notes.

10. If the user asks:
- summarize the PDF
- summarize the uploaded notes
- give me important topics
- what are the key points
- create revision notes

Treat these as requests about the uploaded notes.

=====================================================
UPLOADED NOTES
=====================================================

{context}

=====================================================
QUESTION
=====================================================

{query}
"""
    messages = conversation_history.copy()

    messages.append({
    "role": "user",
    "content": prompt
})

    answer = groq_chat(
    messages,
    model=CHAT_MODEL
)

    conversation_history.append({
        "role": "assistant",
        "content": answer
    })

    source_chunks = [
        ALL_CHUNKS[idx]
        for idx in indices[0]
    ]

    return {
        "answer": answer,
        "sources": source_chunks
    }


def generate_quiz():

    global ALL_CHUNKS

    if len(ALL_CHUNKS) == 0:
        return """
1. What is Machine Learning?
A) Database
B) Learning from data
C) Operating System
D) Compiler

Answer: B
"""

    text = " ".join(ALL_CHUNKS[:3])

    sentences = [
        s.strip()
        for s in text.split(".")
        if len(s.strip()) > 30
    ]

    quiz = []

    for i, sentence in enumerate(sentences[:5]):

        quiz.append(
            f"""
{i+1}. {sentence[:80]}?

A) True
B) False
C) Depends
D) None

Answer: A
"""
        )

    return "\n".join(quiz)


def generate_quiz_json():

    global QUIZ_CACHE
    global ALL_CHUNKS

    if QUIZ_CACHE is not None:
        return QUIZ_CACHE

    if len(ALL_CHUNKS) == 0:
        return []

    import random

    selected_chunks = random.sample(
    ALL_CHUNKS,
    min(8, len(ALL_CHUNKS))
)

    context = "\n\n".join(selected_chunks)

    prompt = f"""
Generate exactly 10 UNIQUE multiple choice questions.

Rules:

- Questions must be complete sentences.
- Questions must test concepts.
- Do not copy notes directly.
- Use different topics from the notes.
- Every question must have 4 options.
- One correct answer only.

Return ONLY valid JSON.

Format:

[
  {{
    "question":"...",
    "options":["A","B","C","D"],
    "answer":"..."
  }}
]

NOTES:

{context}
"""

    try:

        content = groq_chat(
    [
        {
            "role":"user",
            "content":prompt
        }
    ],
    model=QUIZ_MODEL
)

        start = content.find("[")
        end = content.rfind("]") + 1

        quiz = json.loads(
            content[start:end]
        )

        QUIZ_CACHE = quiz

        return quiz

    except Exception as e:

        print("Quiz Error:", e)
        print("RAW RESPONSE:")
        print(content)

        return []



def generate_flashcards():

    global ALL_CHUNKS
    global FLASHCARD_CACHE

    # Return cached flashcards
    if FLASHCARD_CACHE is not None:
       return FLASHCARD_CACHE

    if len(ALL_CHUNKS) == 0:
       return []

    selected_chunks = random.sample(
        ALL_CHUNKS,
        min(5, len(ALL_CHUNKS))
    )

    context = "\n\n".join(selected_chunks)

    prompt = f"""
Create 10 flashcards from the notes.

Return ONLY valid JSON.

Format:

[
  {{
    "question":"...",
    "answer":"..."
  }}
]

Rules:
- Generate exactly 10 flashcards
- Keep answers under 20 words
- Use only notes
- Return JSON only

NOTES:

{context}
"""

    try:
        content = groq_chat(
    [
        {
            "role":"user",
            "content":prompt
        }
    ],
    model=FLASHCARD_MODEL
)

        start = content.find("[")
        end = content.rfind("]") + 1

        flashcards = json.loads(content[start:end])

        # SAVE TO CACHE
        FLASHCARD_CACHE = flashcards

        return flashcards

    except Exception as e:
        print("Flashcard Error:", e)
        return []
    


def generate_summary():

    global ALL_CHUNKS
    global SUMMARY_CACHE

    if len(ALL_CHUNKS) == 0:
        return "No notes uploaded."

    context = "\n\n".join(
        ALL_CHUNKS[:5]
    )

    SUMMARY_CACHE = groq_chat(
    [
        {
            "role":"user",
            "content":f"""

Create structured study notes from these notes.

Format:

# Summary

# Important Topics

# Key Definitions

# Important Formulas

# Key Takeaways

NOTES:

{context}

"""
        }
    ],
    model=CHAT_MODEL
)

    return SUMMARY_CACHE


def generate_study_notes():

    global ALL_CHUNKS

    if len(ALL_CHUNKS) == 0:
        return "No PDF uploaded."

    context = "\n\n".join(ALL_CHUNKS[:5])

    prompt = f"""
Create detailed study notes.

Rules:
- Use headings
- Use bullet points
- Include important concepts
- Include formulas if present
- Make notes exam-ready

NOTES:

{context}
"""

    return groq_chat(
    [
        {
            "role":"user",
            "content":prompt
        }
    ],
    model=CHAT_MODEL
)


def search_notes(query):

    global model
    global index
    global chunks

    if index is None:
        return []

    query_embedding = model.encode(
        [query],
        convert_to_numpy=True
    )

    distances, indices = index.search(
    query_embedding.astype("float32"),
    k=min(10, len(ALL_CHUNKS))
)

    results = []

    for idx in indices[0]:
        results.append(ALL_CHUNKS[idx])

    return results


def generate_viva_question():
    global ALL_CHUNKS

    if len(ALL_CHUNKS) == 0:
        return {
            "question": "No notes uploaded."
        }

    context = "\n\n".join(
        ALL_CHUNKS[:5]
    )

    prompt = f"""

Generate ONE viva voce question from these notes.

Return ONLY the question.

NOTES:

{context}
"""

    return {
    "question": groq_chat(
        [
            {
                "role":"user",
                "content":prompt
            }
        ],
        model=CHAT_MODEL
    )
}

def evaluate_viva_answer(
    question,
    answer
):
    context = "\n\n".join(
        ALL_CHUNKS[:5]
    )

    prompt = f"""

You are an examiner.

QUESTION:
{question}

STUDENT ANSWER:
{answer}

NOTES:
{context}

Evaluate:

1. Score out of 10
2. Strengths
3. Improvements

Return concise feedback.
"""

    return {
    "feedback": groq_chat(
        [
            {
                "role":"user",
                "content":prompt
            }
        ],
        model=CHAT_MODEL
    )
}

def predict_exam_questions():
    global ALL_CHUNKS

    if len(ALL_CHUNKS) == 0:
        return "No PDF uploaded."

    context = "\n\n".join(
        ALL_CHUNKS[:5]
    )

    prompt = f"""

You are an experienced university examiner preparing an end-semester question bank.

Instructions:

* Generate questions ONLY from the provided notes.
* Questions must be clear, academic, and exam-oriented.
* Do NOT copy sentences directly from the notes.
* Cover different topics and concepts.
* Avoid duplicate or similar questions.
* Use proper university examination language.
* Maintain exact formatting.
* Leave one blank line after every question.
* Use bullet points (•) for each question.
* Do NOT provide answers.


❖ 8 Marks Questions (Long Answer)

Generate 5 analytical and descriptive questions that require detailed explanations, derivations, comparisons, diagrams, or applications.

Examples:

* Explain with suitable examples.
* Compare and contrast.
* Discuss the working and applications.
* Derive and justify.


❖ 5 Marks Questions (Medium Answer)

Generate 4 concept-based questions that require moderate explanations.

Examples:

* Explain the concept.
* Describe the process.
* List and explain components.
* Discuss advantages and limitations.


❖ 2 Marks Questions (Short Answer)

Generate 3 very short questions that can be answered in 2–4 lines.

Examples:

* Define.
* State.
* List.
* Mention the purpose of.



Output Format:

❖ 8 Marks Questions

• Question 1

• Question 2

• Question 3

• Question 4

• Question 5

❖ 5 Marks Questions

• Question 1

• Question 2

• Question 3

• Question 4

❖ 2 Marks Questions

• Question 1

• Question 2

• Question 3



NOTES:

{context}


{context}
"""

    return groq_chat(
    [
        {
            "role":"user",
            "content":prompt
        }
    ],
    model=CHAT_MODEL
)

def reset_conversation():
    global conversation_history
    conversation_history.clear()