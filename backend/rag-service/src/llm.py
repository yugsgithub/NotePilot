from groq import Groq
from dotenv import load_dotenv
from pathlib import Path
import os

env_path = Path(__file__).resolve().parents[3] / ".env"
load_dotenv(env_path)

print("Loading .env from:", env_path)
print("Groq Key:", os.getenv("GROQ_API_KEY"))   # Temporary

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

# Default model
MODEL = "llama-3.3-70b-versatile"


def chat(messages, model=MODEL, temperature=0.3, max_tokens=1200):
    """
    Send chat messages to Groq and return the assistant response.
    """

    response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=temperature,
        max_completion_tokens=max_tokens,
    )

    return response.choices[0].message.content


if __name__ == "__main__":
    response = chat(
        [
            {
                "role": "user",
                "content": "What is Machine Learning?"
            }
        ]
    )

    print(response)