"""
Initialize the PolicyMind PostgreSQL database.

This script:
  1. Connects to the default 'postgres' database as admin
  2. Creates the 'policymind' database and app user if they don't exist
  3. Creates all tables defined in db/models.py

On managed cloud hosts (Supabase / Neon / RDS etc.) the database + role
already exist and CREATE ROLE / CREATE DATABASE are not permitted, so
steps 1-2 are skipped automatically.

Usage:
    (venv) python -m db.init_db
"""

import os
import sys
import getpass

# Add parent directory to path so we can import db.session
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError, ProgrammingError
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

# ---------------------------------------------------------------------------
# 1. Create database and role (connect to default 'postgres' database)
# ---------------------------------------------------------------------------
ADMIN_USER = os.getenv("POSTGRES_ADMIN_USER", "postgres")
ADMIN_PASSWORD = os.getenv("POSTGRES_ADMIN_PASSWORD", "")
DB_HOST = os.getenv("POSTGRES_HOST", "localhost")
DB_PORT = os.getenv("POSTGRES_PORT", "5432")
DB_NAME = os.getenv("POSTGRES_DB", "policymind")
APP_USER = os.getenv("POSTGRES_USER", "policymind_app")
APP_PASSWORD = os.getenv("POSTGRES_PASSWORD", "policymind_secret")

MANAGED_HOST_MARKERS = (
    "supabase",
    "pooler",
    "neon",
    "rds.amazonaws.com",
    "azure",
    "railway",
)


def is_managed_host() -> bool:
    """Detect managed cloud PostgreSQL (Supabase/Neon/etc.).

    On managed hosts the database + role already exist and CREATE ROLE /
    CREATE DATABASE are not permitted. We skip straight to creating tables.
    """
    host = (DB_HOST or "").lower()
    return any(marker in host for marker in MANAGED_HOST_MARKERS)


def create_database_and_role():
    """Connect as admin and create the database + app role if they don't exist.

    Skipped automatically on managed cloud hosts (Supabase/Neon/etc.) where
    the role and database already exist and CREATE privileges are restricted.
    """
    if is_managed_host():
        print(f"  ℹ️  Managed cloud host detected ({DB_HOST}).")
        print("     Skipping CREATE ROLE / CREATE DATABASE (already provisioned).")
        return

    admin_url = f"postgresql://{ADMIN_USER}:{ADMIN_PASSWORD}@{DB_HOST}:{DB_PORT}/postgres"
    engine = create_engine(admin_url, isolation_level="AUTOCOMMIT")

    try:
        with engine.connect() as conn:
            # Check / create app role
            result = conn.execute(
                text(f"SELECT 1 FROM pg_roles WHERE rolname = '{APP_USER}'")
            )
            if result.scalar() is None:
                print(f"Creating role '{APP_USER}'...")
                conn.execute(text(f"CREATE ROLE {APP_USER} LOGIN PASSWORD '{APP_PASSWORD}'"))
                print(f"  ✅ Role '{APP_USER}' created.")
            else:
                print(f"  ℹ️  Role '{APP_USER}' already exists.")

            # Check / create database
            result = conn.execute(
                text(f"SELECT 1 FROM pg_database WHERE datname = '{DB_NAME}'")
            )
            if result.scalar() is None:
                print(f"Creating database '{DB_NAME}'...")
                conn.execute(text(f"CREATE DATABASE {DB_NAME} OWNER {APP_USER}"))
                print(f"  ✅ Database '{DB_NAME}' created.")
            else:
                print(f"  ℹ️  Database '{DB_NAME}' already exists.")
    except OperationalError as e:
        print(f"\n❌ Could not connect to PostgreSQL as admin '{ADMIN_USER}'.")
        print(f"   Error: {e}")
        print("\n   Make sure PostgreSQL is installed and running on port 5432.")
        print("   You may need to update POSTGRES_ADMIN_PASSWORD in backend/.env")
        sys.exit(1)
    finally:
        engine.dispose()


# ---------------------------------------------------------------------------
# 2. Create all tables
# ---------------------------------------------------------------------------
def create_tables():
    """Import models and create all tables in the app database."""
    print("\nCreating tables in the policymind database...")
    from db.session import engine as app_engine, Base
    from db.models import (  # noqa: F401 - ensure models are loaded
        User, ChatSession, ChatMessage, Simulation,
        Bookmark, BookmarkRegulation, HistoryEntry, Document
    )

    Base.metadata.create_all(bind=app_engine)
    print("  ✅ All tables created successfully.")


# ---------------------------------------------------------------------------
# 3. Run
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    print("=" * 60)
    print("  PolicyMind Database Initialization")
    print("=" * 60)
    print(f"  Admin user:  {ADMIN_USER}@{DB_HOST}:{DB_PORT}")
    print(f"  App user:    {APP_USER}")
    print(f"  Database:    {DB_NAME}")
    print("=" * 60)

    if not ADMIN_PASSWORD:
        print("\n⚠️  POSTGRES_ADMIN_PASSWORD is empty in .env")
        pw = getpass.getpass("Enter PostgreSQL admin password (blank for trust auth): ")
        os.environ["POSTGRES_ADMIN_PASSWORD"] = pw

    create_database_and_role()
    create_tables()

    print("\n" + "=" * 60)
    print("  ✅ Database initialization complete!")
    print("=" * 60)
    print(f"\n  Connection string:")
    print(f"  postgresql://{APP_USER}:****@{DB_HOST}:{DB_PORT}/{DB_NAME}")
    print()

