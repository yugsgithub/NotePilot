def chunk_text(text):
    paragraphs = text.split("\n\n")
    chunks = []
    current_chunk = ""

    for para in paragraphs:
        if not para.strip():
            continue

        if current_chunk:
            candidate = current_chunk + "\n\n" + para
        else:
            candidate = para

        if len(candidate) < 800:
            current_chunk = candidate
        else:
            if current_chunk:
                chunks.append(current_chunk)
            current_chunk = para

    if current_chunk:
        chunks.append(current_chunk)

    return chunks




if __name__ == "__main__":

    sample_text = """
    Machine Learning is a subset of Artificial Intelligence.
    It enables computers to learn from data.
    Gradient Descent is used for optimization.
    """ * 20

    chunks = chunk_text(sample_text)

    print(f"Total Chunks: {len(chunks)}")

    for i, chunk in enumerate(chunks):
        print(f"\nChunk {i+1}:")
        print(chunk[:100])