# PolicyMind — Sharing the Database Between Two Laptops

The PostgreSQL database currently lives **only on the host laptop** (`localhost`). To let a
friend see the same bookmarks, history, chat messages, and simulations, move the database to a
**free cloud PostgreSQL** service. Both laptops connect to the same cloud DB → data syncs instantly.

---

## Recommended: Supabase (free) — ~5 minutes

### 1. Create the cloud database (do this once, on either laptop)

1. Go to <https://supabase.com> → **Start your project** / **Sign in** (GitHub or email).
2. Create a **new project** (Free plan is fine):
   - **Name:** `policymind`
   - **Database password:** set a strong one and copy it somewhere safe (you will need it).
   - **Region:** pick the closest one to you both.
   - Click **Create new project** and wait ~2 minutes.
3. In the project dashboard:
   - Go to **Connect** (top bar) → **Connection string** → copy the **URI**.
   - It looks like:
     ```
     postgresql://postgres.yourref:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres
     ```
   - (If not shown, click **Direct connection** / use port 5432 with
     `db.yourref.supabase.co`.)

### 2. Run the one-time table setup

On **either** laptop (only needs to be done once — the tables are shared):

```powershell
cd backend
python -m db.init_db
```

> `init_db.py` already reads the connection info from `backend/.env`. If the Supabase admin
> user/password is set there, it will create the role + database + tables in the cloud.

### 3. Point both laptops at the cloud DB

Update `backend/.env` on **both** laptops with the cloud connection:

```env
POSTGRES_HOST=db.yourref.supabase.co        # <-- the host from Supabase
POSTGRES_PORT=5432
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=YOUR_SUPABASE_PASSWORD
POSTGRES_ADMIN_USER=postgres
POSTGRES_ADMIN_PASSWORD=YOUR_SUPABASE_PASSWORD
```

### 4. Each laptop runs the backend locally

```powershell
cd backend
uvicorn app:app --reload --port 8000
```

And the frontend:

```powershell
cd Frontend
npm run dev
```

Now any bookmark / history / chat / simulation saved on either laptop is visible on the other.

---

## ❓ Do you need to install PostgreSQL on her laptop?

**No.** Since the database lives in the cloud (Supabase), neither laptop needs a local
PostgreSQL server. The Python backend connects to the cloud DB automatically using the
`psycopg2-binary` package (already listed in `requirements.txt`). The cloud database is
reachable over the internet, so a local install would be redundant.

What her laptop **does** need:

| Software | Needed? | Why |
|---|---|---|
| PostgreSQL server | ❌ No | DB is in the cloud, not local |
| Python 3.11+ | ✅ Yes | Runs the FastAPI backend |
| Ollama + `llama3.2:3b` | ✅ Yes | Local LLM that answers chat questions |
| Node.js | ✅ Yes | Runs the React frontend (`npm run dev`) |
| Project folder + `backend/.env` | ✅ Yes | Code + the same Supabase credentials |

> Only **one** person ever runs `python -m db.init_db` (once) — the tables are created in
> the shared cloud database and are automatically available to both laptops.

---

## Setup for the friend's laptop (one time)

1. **Clone / copy the project** folder to her laptop.
2. **Install Python 3.11+** and create the venv:

   ```powershell
   cd backend
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```

3. **Set `backend/.env`** to the same cloud credentials (step 3 above).
4. **Install Ollama** and run `ollama pull llama3.2:3b`.
5. **Build the local vector index** (each laptop keeps its own Chroma copy of the PDFs):

   ```powershell
   cd backend
   python ingest.py
   ```

   > `ingest.py` also records the documents into the shared `documents` table.

6. Start backend (`uvicorn app:app --reload --port 8000`) and frontend (`npm run dev`).

---

## Alternative plans (if you don't want a cloud account)

| Plan | Pros | Cons |
|---|---|---|
| **Neon** (<https://neon.tech>) | Serverless Postgres, free 0.5GB, nice UI | Similar sign-up to Supabase |
| **Railway / Render** | Deploy backend too | Add costs, more config |
| **ngrok tunnel** | No new account for the DB | DB is only reachable while your laptop is on and tunnel runs |

---

## Notes & troubleshooting

- **`.env` is git-ignored** — it's not in the repo. Share the file with your friend privately
  (or use a `.env.example` + a shared password manager).
- **Firewall:** Supabase/Neon expose PostgreSQL over the internet — no port-forwarding needed.
- **String won't connect?** Make sure you're using the host/port that matches the Supabase
  connection type (pooler uses port **6543**, direct uses **5432**).
- Run `python test_db.py` in `backend` to confirm connectivity before starting the server.

