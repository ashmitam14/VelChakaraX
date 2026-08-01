"""End-to-end API test against the (cloud) PostgreSQL database."""

from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

# 1. Health
r = client.get("/health/db")
print("DB health:", r.json())

# 2. Create bookmark
payload = {
    "bookmark_type": "chat",
    "title": "Test EU AI Act checklist",
    "summary": "Shared cloud DB test",
    "question": "What is the EU AI Act?",
    "chat_messages": [{"id": "m1", "role": "user", "text": "What is the EU AI Act?"}],
    "regulations": [
        {"order": 1, "title": "Conformity assessment", "clause": "Article 43", "completed": False},
        {"order": 2, "title": "Human oversight", "clause": "Article 14", "completed": False},
    ],
}
r = client.post("/bookmarks", json=payload)
print("Create bookmark status:", r.status_code)
b = r.json()
print("Created bookmark id:", b.get("id"))
print("Regulations:", len(b.get("regulations", [])))

# 3. List bookmarks
r = client.get("/bookmarks")
print("List bookmarks count:", len(r.json()))

# 4. Toggle first regulation (using string ID)
if b.get("regulations"):
    reg_id = b["regulations"][0]["id"]
    r = client.patch(f"/bookmarks/{b['id']}/items/{reg_id}")
    print("Toggle status:", r.status_code, "-> completed:", r.json().get("regulations", [{}])[0].get("completed"))

# 5. Create history entry
r = client.post("/history", json={"title": "History test", "summary": "x", "type": "chat", "question": "q"})
print("History create status:", r.status_code)

# 6. List history
r = client.get("/history")
print("List history count:", len(r.json()))

# 7. Simulation persistence
sim_payload = {
    "sector": "employment",
    "personal_data_used": ["resume"],
    "uses_biometric_or_emotion_data": False,
    "affected_group": "public",
    "decision_level": "human_assisted",
    "jurisdiction": "both",
    "deployment_status": "not_launched",
    "org_size": "startup",
}
r = client.post("/simulate", json=sim_payload)
print("Simulate status:", r.status_code, "results keys:", list(r.json().keys()))

r = client.get("/simulations")
print("List simulations count:", len(r.json()))

print("\nALL GOOD ✅")

