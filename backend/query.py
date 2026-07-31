from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings

# -----------------------------
# Configuration
# -----------------------------
CHROMA_FOLDER = "chroma_db"

# -----------------------------
# Load SBERT Embedding Model
# (Must match ingest.py)
# -----------------------------
embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# -----------------------------
# Load Chroma Database
# -----------------------------
db = Chroma(
    persist_directory=CHROMA_FOLDER,
    embedding_function=embedding_model
)

print("\n==============================")
print(" AI Compliance Assistant")
print("==============================\n")

while True:
    question = input("Ask a question (or type 'exit'): ")

    if question.lower() == "exit":
        print("\nGoodbye!")
        break

    results = db.similarity_search(question, k=3)

    print("\nTop Matching Chunks:\n")

    for i, doc in enumerate(results, start=1):
        print(f"Result {i}")
        print("-" * 60)
        print(doc.page_content)
        print()