"""SQLAlchemy ORM models for PolicyMind PostgreSQL storage.

Tables:
  - users: registered accounts
  - chat_sessions: grouping of chat messages
  - chat_messages: individual Q&A turns
  - simulations: risk simulator inputs + outputs
  - bookmarks: saved compliance checklists
  - bookmark_regulations: individual checklist items within a bookmark
  - history_entries: archived completed checklists
  - documents: metadata about ingested regulatory PDFs
"""

import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, DateTime, JSON, ForeignKey, Float
)
from sqlalchemy.orm import relationship
from db.session import Base


# ---------------------------------------------------------------------------
# Users
# ---------------------------------------------------------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    organization = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)


# ---------------------------------------------------------------------------
# Chat Sessions
# ---------------------------------------------------------------------------
class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # null until auth is wired
    title = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)

    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan", order_by="ChatMessage.created_at")


# ---------------------------------------------------------------------------
# Chat Messages
# ---------------------------------------------------------------------------
class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.id"), nullable=False, index=True)
    role = Column(String(20), nullable=False)  # "user" | "assistant"
    content = Column(Text, nullable=False)
    prompt = Column(Text, nullable=True)  # original user prompt (for assistant messages)
    source_documents = Column(JSON, nullable=True)  # list of retrieved chunk metadata
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    session = relationship("ChatSession", back_populates="messages")


# ---------------------------------------------------------------------------
# Simulations
# ---------------------------------------------------------------------------
class Simulation(Base):
    __tablename__ = "simulations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    jurisdiction = Column(String(20), nullable=False, default="both")  # eu | india | both
    system_description = Column(JSON, nullable=False)  # full SystemDescription dict
    results = Column(JSON, nullable=False)  # classification results (eu/india keys)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)


# ---------------------------------------------------------------------------
# Bookmarks
# ---------------------------------------------------------------------------
class Bookmark(Base):
    __tablename__ = "bookmarks"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    bookmark_type = Column(String(20), nullable=False, default="chat")  # "chat" | "simulation"
    title = Column(String(255), nullable=False)
    summary = Column(Text, nullable=True)
    question = Column(Text, nullable=True)  # original question (for chat bookmarks)
    chat_messages = Column(JSON, nullable=True)  # snapshot of chat messages at bookmark time
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)

    regulations = relationship("BookmarkRegulation", back_populates="bookmark", cascade="all, delete-orphan", order_by="BookmarkRegulation.order")


class BookmarkRegulation(Base):
    __tablename__ = "bookmark_regulations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    bookmark_id = Column(Integer, ForeignKey("bookmarks.id"), nullable=False, index=True)
    order = Column(Integer, nullable=False, default=1)
    title = Column(String(500), nullable=False)
    clause = Column(String(255), nullable=True)
    completed = Column(Boolean, default=False, nullable=False)

    bookmark = relationship("Bookmark", back_populates="regulations")


# ---------------------------------------------------------------------------
# History Entries
# ---------------------------------------------------------------------------
class HistoryEntry(Base):
    __tablename__ = "history_entries"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    title = Column(String(255), nullable=False)
    summary = Column(Text, nullable=True)
    entry_type = Column(String(20), nullable=False, default="chat")  # "chat" | "simulation"
    question = Column(Text, nullable=True)
    messages = Column(JSON, nullable=True)
    regulations = Column(JSON, nullable=True)
    score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    completed_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)


# ---------------------------------------------------------------------------
# Documents (Ingested PDFs)
# ---------------------------------------------------------------------------
class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=True)
    total_pages = Column(Integer, nullable=True, default=0)
    total_chunks = Column(Integer, nullable=True, default=0)
    chunk_size = Column(Integer, nullable=True, default=500)
    chunk_overlap = Column(Integer, nullable=True, default=100)
    ingested_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
