import json
import os

scripts_dir = os.path.dirname(__file__)
data_dir = os.path.join(scripts_dir, "..", "public", "data")

f1 = os.path.join(scripts_dir, "temp_core_questions.json")
f2 = os.path.join(scripts_dir, "temp_lexical_questions.json")
f3 = os.path.join(scripts_dir, "temp_rc_cloze_questions.json")

with open(f1, "r", encoding="utf-8") as f:
    q1 = json.load(f)
with open(f2, "r", encoding="utf-8") as f:
    q2 = json.load(f)
with open(f3, "r", encoding="utf-8") as f:
    q3 = json.load(f)

all_questions = q1 + q2 + q3

# Clean IDs to ensure sequential uniqueness
seen_ids = set()
for idx, q in enumerate(all_questions, 1):
    new_id = f"eng_{idx:04d}"
    q["id"] = new_id
    seen_ids.add(new_id)
    assert len(q["options"]["en"]) == 5, f"Options en count != 5 in {new_id}"
    assert len(q["options"]["hi"]) == 5, f"Options hi count != 5 in {new_id}"
    assert 0 <= q["correctAnswer"] <= 4, f"Invalid correctAnswer in {new_id}"

target_path = os.path.join(data_dir, "questions.json")
with open(target_path, "w", encoding="utf-8") as f:
    json.dump(all_questions, f, indent=2, ensure_ascii=False)

# Remove temporary files
for temp_f in [f1, f2, f3]:
    if os.path.exists(temp_f):
        os.remove(temp_f)

print(f"Successfully compiled {len(all_questions)} verified bilingual questions into {target_path}!")

# Print topic statistics
topic_counts = {}
type_counts = {}
for q in all_questions:
    t = q.get("topicName", "Other")
    topic_counts[t] = topic_counts.get(t, 0) + 1
    ptype = q.get("type", "Other")
    type_counts[ptype] = type_counts.get(ptype, 0) + 1

print("\n--- Topic Distribution ---")
for t, count in sorted(topic_counts.items(), key=lambda x: -x[1]):
    print(f"  {t}: {count}")

print("\n--- Provenance Breakdown ---")
for p, count in sorted(type_counts.items(), key=lambda x: -x[1]):
    print(f"  {p}: {count}")
