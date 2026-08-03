import json

# 檔名
EN_FILE = "hidden_words_en.json"
ZH_FILE = "hidden_words_zh.json"
OUT_FILE = "hidden_words_combined.json"

with open(EN_FILE, "r", encoding="utf-8") as f:
    en_data = json.load(f)

with open(ZH_FILE, "r", encoding="utf-8") as f:
    zh_data = json.load(f)

# 轉成 dict 方便用 id 對齊
en_map = {item["id"]: item for item in en_data}
zh_map = {item["id"]: item for item in zh_data}

combined = []

for id_, en_item in en_map.items():
    zh_item = zh_map.get(id_)

    combined.append({
        "id": id_,
        "name": en_item.get("name", str(id_)),
        "text": {
            "en": en_item.get("description", "").strip(),
            "zh": zh_item.get("description", "").strip() if zh_item else ""
        },
        "author": "Bahá’u’lláh"
    })

with open(OUT_FILE, "w", encoding="utf-8") as f:
    json.dump(combined, f, ensure_ascii=False, indent=2)

print(f"✅ Combined JSON written to {OUT_FILE}")
