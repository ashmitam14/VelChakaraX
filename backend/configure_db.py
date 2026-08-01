"""One-time helper to point PolicyMind at a cloud PostgreSQL database.

Given a PostgreSQL connection URI, this script rewrites backend/.env with the
matching host / port / db / user / password so all backend scripts connect to
the remote database.

Usage:
    (venv) python configure_db.py "postgresql://db.yourref.supabase.co:5432/postgres"
"""

import os
import re
import sys
from urllib.parse import urlparse, unquote


def parse_uri(uri: str) -> dict:
    """Parse a postgresql:// URI into components."""
    if not uri.startswith("postgresql://") and not uri.startswith("postgres://"):
        raise ValueError("URI must start with postgresql:// or postgres://")

    parsed = urlparse(uri)
    return {
        "host": parsed.hostname or "localhost",
        "port": parsed.port or 5432,
        "db": (parsed.path or "/postgres").lstrip("/") or "postgres",
        "user": unquote(parsed.username or "postgres"),
        "password": unquote(parsed.password or ""),
    }


def update_env(components: dict) -> None:
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")

    existing = {}
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and "=" in line and not line.startswith("#"):
                    key, _, value = line.partition("=")
                    existing[key.strip()] = value.strip()

    existing.update(
        {
            "POSTGRES_HOST": components["host"],
            "POSTGRES_PORT": str(components["port"]),
            "POSTGRES_DB": components["db"],
            "POSTGRES_USER": components["user"],
            "POSTGRES_PASSWORD": components["password"],
            "POSTGRES_ADMIN_USER": components["user"],
            "POSTGRES_ADMIN_PASSWORD": components["password"],
        }
    )

    with open(env_path, "w", encoding="utf-8") as f:
        for key, value in existing.items():
            f.write(f"{key}={value}\n")

    print(f"\n✅ Updated {env_path}")
    print(f"   Host     : {components['host']}")
    print(f"   Port     : {components['port']}")
    print(f"   Database : {components['db']}")
    print(f"   User     : {components['user']}")


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    uri = sys.argv[1].strip().strip('"').strip("'")
    try:
        comps = parse_uri(uri)
        update_env(comps)
        print("\nNext step: run  python -m db.init_db  to create tables on the cloud DB.")
        print("Then run   python test_db.py     to verify connectivity.")
    except ValueError as e:
        print(f"❌ {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()

