from pypdf import PdfReader
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np


def extract_text(pdf_path):
    reader = PdfReader(pdf_path)

    text = ""

    for page in reader.pages:
        page_text = page.extract_text()

        if page_text:
            text += page_text + "\n"

    return text


def chunk_text(text, chunk_size=500):
    chunks = []

    for i in range(0, len(text), chunk_size):
        chunks.append(text[i:i + chunk_size])

    return chunks


model = SentenceTransformer("all-MiniLM-L6-v2")

pdf_text = extract_text("uploads/test.pdf")

new_chunks = chunk_text(pdf_text)

embeddings = model.encode(new_chunks)

dimension = embeddings.shape[1]

index = faiss.IndexFlatL2(dimension)

index.add(np.array(embeddings, dtype="float32"))

query = input("Ask a question: ")

query_embedding = model.encode([query])

distances, indices = index.search(
    np.array(query_embedding, dtype="float32"),
    k=3
)

print("\nRelevant Chunks:\n")

for idx in indices[0]:
    print("=" * 50)
    print(chunks[idx])