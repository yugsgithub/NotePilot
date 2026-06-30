from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

sentences = [
    "Machine Learning is a subset of AI",
    "Artificial Intelligence is transforming the world",
    "I love eating pizza"
]

embeddings = model.encode(sentences)

print("Number of vectors:", len(embeddings))

print("Vector Dimension:", len(embeddings[0]))

print("\nFirst 10 values of first vector:")

print(embeddings[0][:10])