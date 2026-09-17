import pandas as pd
import json
import os
from pathlib import Path
from indic_transliteration import sanscript
from indic_transliteration.sanscript import transliterate

def convert_excel_to_json(excel_path, json_path):
    print(f"Reading {excel_path}...")
    df = pd.read_excel(excel_path)
    
    # Ensure Word column exists
    if 'Word' not in df.columns:
        print("Error: 'Word' column not found in Excel file.")
        return
        
    terms = []
    
    print(f"Processing {len(df)} rows...")
    for index, row in df.iterrows():
        word = str(row['Word']).strip()
        if not word or word == 'nan':
            continue
            
        # Transliterate from Devanagari to IAST (Roman)
        try:
            transliterated = transliterate(word, sanscript.DEVANAGARI, sanscript.IAST)
        except Exception as e:
            print(f"Error transliterating {word}: {e}")
            transliterated = word
            
        term_dict = {
            "term": transliterated,
            "devanagari": word,
            "category": "",
            "definition": "",
            "botanical_name": "",
            "part_used": "",
            "form": "",
            "quantity": ""
        }
        terms.append(term_dict)
        
        if (index + 1) % 10000 == 0:
            print(f"Processed {index + 1} rows...")
            
    print(f"Total processed valid terms: {len(terms)}")
    
    # Save to JSON
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(terms, f, ensure_ascii=False, indent=2)
        
    print(f"Successfully saved to {json_path}")

if __name__ == "__main__":
    base_dir = Path(__file__).resolve().parent.parent
    excel_file = Path("/mnt/c/Users/EW0116TU/Downloads/postOCR/postOCR/data/newword.xlsx")
    json_file = base_dir / "services" / "sanskrit_processor" / "data" / "ayurveda_dictionary.json"
    
    # Ensure output directory exists
    json_file.parent.mkdir(parents=True, exist_ok=True)
    
    convert_excel_to_json(str(excel_file), str(json_file))
