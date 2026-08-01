"""Quick connectivity test for the PostgreSQL database used by PolicyMind.

Usage:
    (venv) python test_db.py
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from db.session import engine, Base
from db.models import (
    User, ChatSession, ChatMessage, Simulation,
    Bookmark, BookmarkRegulation, HistoryEntry, Document
)


def main():
    print("=" * 60)
    print("  PolicyMind PostgreSQL Connectivity Test")
    print("=" * 60)

    try:
        # 1. Connect
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version()"))
            version = result.scalar()
            print(f"\n✅ Connected to PostgreSQL")
            print(f"   Server: {version}")

        # 2. Ensure tables exist
        Base.metadata.create_all(bind=engine)
        print("✅ Tables verified / created.")

        # 3. List tables
        with engine.connect() as conn:
            rows = conn.execute(text(
                "SELECT table_name FROM information_schema.tables "
                "WHERE table_schema = 'public' ORDER BY table_name"
            )).fetchall()
            print("\nTables in database:")
            for row in rows:
                print(f"   - {row[0]}")

        # 4. Quick insert + read roundtrip
        from db.session import SessionLocal
        session = SessionLocal()
        try:
            chat = ChatSession(title="DB test session")
            session.add(chat)
            session.flush()
            msg = ChatMessage(
                session_id=chat.id,
                role="user",
                content="Hello PostgreSQL test",
            )
            session.add(msg)
            session.commit()

            count = session.query(ChatMessage).count()
            print(f"\n✅ Roundtrip insert OK (chat_messages count = {count})")

            # cleanup
            session.delete(msg)
            session.delete(chat)
            session.commit()
        finally:
            session.close()

        print("\n" + "=" * 60)
        print("  ✅ All PostgreSQL checks passed!")
        print("=" * 60)

    except Exception as e:
        print(f"\n❌ Database connection failed: {e}")
        print("\n   Make sure PostgreSQL is installed and running.")
        print("   Check connection settings in backend/.env")
        sys.exit(1)


if __name__ == "__main__":
    main()
