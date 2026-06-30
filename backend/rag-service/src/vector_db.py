import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

chunks = [
    "Machine Learning is a subset of Artificial Intelligence.",
    "The Viterbi Algorithm is used in Hidden Markov Models.",
    "Gradient Descent is an optimization algorithm.",
    "Neural Networks are inspired by the human brain."
]

embeddings = model.encode(chunks)

dimension = embeddings.shape[1]

index = faiss.IndexFlatL2(dimension)

index.add(np.array(embeddings, dtype="float32"))

query = "What is Viterbi Algorithm?"

query_embedding = model.encode([query])

distances, indices = index.search(
    np.array(query_embedding, dtype="float32"),
    k=2
)

print("\nTop Matches:\n")

for idx in indices[0]:
    print(chunks[idx])