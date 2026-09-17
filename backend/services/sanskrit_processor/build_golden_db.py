import os
import json
import pandas as pd

def build_golden_db():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(base_dir, "data")
    
    ayurveda_dict_path = os.path.join(data_dir, "ayurveda_dictionary.json")
    ccras_path = "/mnt/c/Users/EW0116TU/Downloads/postOCR/postOCR/data/ccras_wordlist.txt"
    newword_path = "/mnt/c/Users/EW0116TU/Downloads/postOCR/postOCR/data/newword.xlsx"
    golden_db_path = os.path.join(data_dir, "golden_dictionary.json")

    golden_db = []
    seen_devanagari = set()
    seen_roman = set()

    print("Loading ayurveda_dictionary.json...")
    if os.path.exists(ayurveda_dict_path):
        try:
            with open(ayurveda_dict_path, "r", encoding="utf-8") as f:
                ayurveda_data = json.load(f)
                for entry in ayurveda_data:
                    dev = entry.get("devanagari", "").strip()
                    roman = entry.get("term", "").strip()
                    if dev:
                        seen_devanagari.add(dev)
                    if roman:
                        seen_roman.add(roman.lower())
                    golden_db.append(entry)
            print(f"Loaded {len(ayurveda_data)} entries from ayurveda_dictionary.json")
        except Exception as e:
            print(f"Error loading ayurveda_dictionary.json: {e}")
    else:
        print("ayurveda_dictionary.json not found.")

    print("Loading ccras_wordlist.txt...")
    if os.path.exists(ccras_path):
        try:
            with open(ccras_path, "r", encoding="utf-8") as f:
                ccras_words = [line.strip() for line in f if line.strip()]
                added_ccras = 0
                for word in ccras_words:
                    if word not in seen_devanagari and len(word) > 1:
                        seen_devanagari.add(word)
                        golden_db.append({
                            "term": "",
                            "devanagari": word,
                            "category": "ccras_wordlist",
                            "definition": "",
                            "botanical_name": "",
                            "part_used": "",
                            "form": "",
                            "quantity": ""
                        })
                        added_ccras += 1
            print(f"Added {added_ccras} new entries from ccras_wordlist.txt")
        except Exception as e:
            print(f"Error loading ccras_wordlist.txt: {e}")
    else:
        print("ccras_wordlist.txt not found.")

    print("Loading newword.xlsx...")
    if os.path.exists(newword_path):
        try:
            df = pd.read_excel(newword_path)
            added_newword = 0
            # Ensure the 'Word' column exists
            if 'Word' in df.columns:
                for word in df['Word'].dropna():
                    word = str(word).strip()
                    if word not in seen_devanagari and len(word) > 1:
                        seen_devanagari.add(word)
                        golden_db.append({
                            "term": "",
                            "devanagari": word,
                            "category": "newword_xlsx",
                            "definition": "",
                            "botanical_name": "",
                            "part_used": "",
                            "form": "",
                            "quantity": ""
                        })
                        added_newword += 1
            print(f"Added {added_newword} new entries from newword.xlsx")
        except Exception as e:
            print(f"Error loading newword.xlsx: {e}")
    else:
        print("newword.xlsx not found.")

    # Save the consolidated golden DB
    try:
        with open(golden_db_path, "w", encoding="utf-8") as f:
            json.dump(golden_db, f, ensure_ascii=False, indent=2)
        print(f"\nGolden Database created successfully at: {golden_db_path}")
        print(f"Total Entries: {len(golden_db)}")
    except Exception as e:
        print(f"Error saving golden_dictionary.json: {e}")

if __name__ == "__main__":
    build_golden_db()
