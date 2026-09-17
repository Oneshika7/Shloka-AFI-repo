import json
import os
import re

# We will read the conversation transcript to find the PDF text
TRANSCRIPT_PATH = "/mnt/c/Users/EW0116TU/.gemini/antigravity-ide/brain/8d70c241-527a-4c9b-9fca-da2a9fc8383a/.system_generated/logs/transcript_full.jsonl"
OUTPUT_DICT_PATH = "/mnt/c/Users/EW0116TU/SHLOKA-AFI/backend/app/data/afi_dictionary.json"

def extract_dictionary():
    print("Reading transcript...")
    pdf_text = None
    
    # Read the transcript from the bottom up to find the PDF
    with open(TRANSCRIPT_PATH, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        for line in reversed(lines):
            try:
                data = json.loads(line)
                if data.get('type') == 'USER_INPUT' and '==Start of PDF==' in data.get('content', ''):
                    pdf_text = data['content']
                    break
            except Exception as e:
                continue
                
    if not pdf_text:
        print("Could not find the PDF text in the transcript.")
        return

    print("Found PDF text. Extracting dictionary...")
    
    # Find the start of the dictionary
    dict_start_marker = "APPROXIMATE ENGLISH EQUIVALENTS"
    if dict_start_marker not in pdf_text:
        print("Could not find dictionary start marker.")
        return
        
    dict_text = pdf_text.split(dict_start_marker)[1]
    
    # Clean up the text by removing page headers/footers
    dict_text = re.sub(r'==Screenshot for page \d+==\n?', '', dict_text)
    dict_text = re.sub(r'==Start of OCR for page \d+==\n?', '', dict_text)
    dict_text = re.sub(r'==End of OCR for page \d+==\n?', '', dict_text)
    dict_text = re.sub(r'==End of PDF==\n?', '', dict_text)
    
    # Parse lines
    dictionary = {}
    lines = [line.strip() for line in dict_text.split('\n') if line.strip()]
    
    for line in lines:
        # Most lines are formatted as: "Sanskrit Term    English Term"
        # We can split by 2 or more spaces, or use a heuristic.
        # Since OCR might just use single spaces, we'll look for the first English character to split.
        match = re.search(r'([^\x00-\x7F]+.*?)\s+([A-Za-z0-9].*)', line)
        if match:
            sanskrit_term = match.group(1).strip()
            english_term = match.group(2).strip()
            # Clean up trailing/leading junk
            if sanskrit_term and english_term:
                dictionary[sanskrit_term] = english_term
                
    print(f"Extracted {len(dictionary)} terms.")
    
    # Ensure data directory exists
    os.makedirs(os.path.dirname(OUTPUT_DICT_PATH), exist_ok=True)
    
    with open(OUTPUT_DICT_PATH, 'w', encoding='utf-8') as f:
        json.dump(dictionary, f, ensure_ascii=False, indent=2)
        
    print(f"Dictionary saved to {OUTPUT_DICT_PATH}")

if __name__ == "__main__":
    extract_dictionary()
