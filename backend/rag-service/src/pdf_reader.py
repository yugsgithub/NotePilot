from pypdf import PdfReader

def extract_text(pdf_path):
    reader = PdfReader(pdf_path)

    text = ""

    for page in reader.pages:
        page_text = page.extract_text()

        if page_text:
            text += page_text + "\n"

    return text


if __name__ == "__main__":
    pdf_path = "uploads/test.pdf"

    text = extract_text(pdf_path)

    print("===== PDF CONTENT =====\n")
    print(text[:2000])   # first 2000 characters
    