from ner_engine import get_ner_engine

engine = get_ner_engine()
res = engine.extract_entities("अश्वगन्धा")
print("Matches found:")
for r in res:
    print("-", r["devanagari"], ":", r.get("term", "No Term"))
