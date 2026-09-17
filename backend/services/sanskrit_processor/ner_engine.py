import os
import json

class NEREngine:
    def __init__(self):
        self.golden_db_path = os.path.join(os.path.dirname(__file__), "data", "golden_dictionary.json")
        self.terms = []
        self._load_db()

    def _load_db(self):
        if not os.path.exists(self.golden_db_path):
            print(f"Golden DB not found at {self.golden_db_path}. Please run build_golden_db.py")
            return
            
        try:
            with open(self.golden_db_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                
            # Filter entries that have a valid devanagari string
            valid_entries = [entry for entry in data if entry.get("devanagari") and len(entry["devanagari"].strip()) > 1]
            
            # Sort by length descending to match longest terms first
            self.terms = sorted(valid_entries, key=lambda x: len(x["devanagari"]), reverse=True)
            print(f"NER Engine initialized with {len(self.terms)} terms.")
        except Exception as e:
            print(f"Error loading Golden DB: {e}")

    def extract_entities(self, text: str):
        """
        Scans the text for exact matches from the Golden DB.
        Returns a list of matched entry dictionaries.
        """
        if not text:
            return []
            
        matches = []
        text_to_search = text
        
        for entry in self.terms:
            dev = entry["devanagari"]
            if dev in text_to_search:
                matches.append(entry)
                # To prevent matching substrings of this word later, we could mask it out.
                # However, for now, we just allow overlapping matches if they are valid.
                
                # Limit matches to prevent returning the entire dictionary on a long text
                if len(matches) >= 50:
                    break
                    
        return matches

_engine = None

def get_ner_engine():
    global _engine
    if _engine is None:
        _engine = NEREngine()
    return _engine
