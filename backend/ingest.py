import os
import shutil

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

# -----------------------------
# Configuration
# -----------------------------
DATA_FOLDER = "data"
CHROMA_FOLDER = "chroma_db"

# -----------------------------
# Remove old ChromaDB
# -----------------------------
if os.path.exists(CHROMA_FOLDER):
    print("Removing old ChromaDB...")
    shutil.rmtree(CHROMA_FOLDER)

documents = []

print("\nLoading PDF files...\n")

# -----------------------------
# Load all PDFs
# -----------------------------
for file in os.listdir(DATA_FOLDER):
    if file.lower().endswith(".pdf"):
        path = os.path.join(DATA_FOLDER, file)
        print(f"Loading: {file}")

        loader = PyPDFLoader(path)
        documents.extend(loader.load())

print(f"\nTotal Pages Loaded: {len(documents)}")

# -----------------------------
# Split into smaller chunks
# -----------------------------
splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=100,
    separators=[
        "\n\n",
        "\n",
        ". ",
        " ",
        ""
    ]
)

chunks = splitter.split_documents(documents)

print(f"\nTotal Chunks Created: {len(chunks)}")

# -----------------------------
# Load SBERT Embedding Model
# -----------------------------
print("\nLoading SBERT Embedding Model...\n")

embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# -----------------------------
# Create ChromaDB
# -----------------------------
print("Creating Chroma Vector Database...\n")

db = Chroma.from_documents(
    documents=chunks,
    embedding=embedding_model,
    persist_directory=CHROMA_FOLDER
)

print("\n====================================")
print("✅ ChromaDB created successfully!")
print(f"Indexed {len(chunks)} chunks from {len(documents)} pages.")
print("====================================")