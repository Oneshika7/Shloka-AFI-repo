import os

def load_ocr_confusions():
    """
    Loads OCR confusion pairs from learned_confusions.txt and uploaded_cpairs.txt.
    Returns a dictionary mapping incorrect words to correct words.
    """
    confusions = {}
    
    # Paths to the confusion files
    # The user provided them in postOCR/data, but let's assume we can load them if they exist in data/
    # For now, we will read directly from the source directory, or we can copy them.
    # Let's read directly from the user's Downloads directory as a quick integration, 
    # but ideally they should be in the 'data' directory.
    # Actually, we will load them from the user's provided path.
    
    paths = [
        "/mnt/c/Users/EW0116TU/Downloads/postOCR/postOCR/data/learned_confusions.txt",
        "/mnt/c/Users/EW0116TU/Downloads/postOCR/postOCR/data/uploaded_cpairs.txt"
    ]
    
    for path in paths:
        if os.path.exists(path):
            try:
                with open(path, "r", encoding="utf-8") as f:
                    for line in f:
                        parts = line.strip().split("\t")
                        if len(parts) >= 2:
                            incorrect = parts[0].strip()
                            correct = parts[1].strip()
                            if incorrect and correct:
                                confusions[incorrect] = correct
            except Exception as e:
                print(f"Error loading {path}: {e}")
                
    return confusions

# Load them globally so we don't read the files on every request
OCR_CONFUSIONS = load_ocr_confusions()

def correct_ocr_errors(text: str) -> str:
    """
    Applies OCR corrections to the given text using a simple replace.
    Since Sanskrit words can be long and agglutinated, we use a simple text replacement.
    """
    if not text or not OCR_CONFUSIONS:
        return text
        
    corrected_text = text
    for incorrect, correct in OCR_CONFUSIONS.items():
        if incorrect in corrected_text:
            corrected_text = corrected_text.replace(incorrect, correct)
            
    return corrected_text
