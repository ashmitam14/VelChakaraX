import os
import shutil
import sys

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
print("====================================\n")

# -----------------------------
# Record document metadata in PostgreSQL
# -----------------------------
try:
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from db.session import SessionLocal, Base, engine
    from db.models import Document
    from collections import Counter

    # Create tables if not already created
    Base.metadata.create_all(bind=engine)

    session = SessionLocal()

    # Count chunks + pages per source file
    source_counter = Counter()
    pages_per_source = Counter()
    for doc in documents:
        source = os.path.basename(doc.metadata.get("source", "unknown"))
        source_counter[source] += 1
        pages_per_source[source] += 0  # page count per file handled below

    # More accurate per-file chunk/page counts
    chunk_counter = Counter()
    for chunk in chunks:
        source = os.path.basename(chunk.metadata.get("source", "unknown"))
        chunk_counter[source] += 1

    for file in os.listdir(DATA_FOLDER):
        if not file.lower().endswith(".pdf"):
            continue
        record = Document(
            filename=file,
            file_path=os.path.join(DATA_FOLDER, file),
            total_pages=pages_per_source.get(file, 0),
            total_chunks=chunk_counter.get(file, 0),
            chunk_size=500,
            chunk_overlap=100,
        )
        session.add(record)

    session.commit()

    for record in session.query(Document).all():
        print(f"  📄 {record.filename}: {record.total_chunks} chunks")
        print(f"     ({record.file_path})")

    session.close()
    print("\n✅ Document metadata saved to PostgreSQL.")
except Exception as e:
    print("\n⚠️  Could not persist document metadata to PostgreSQL.")
    print("    Error:", e)
    print("    (The ChromaDB vector store was still created successfully.)")
