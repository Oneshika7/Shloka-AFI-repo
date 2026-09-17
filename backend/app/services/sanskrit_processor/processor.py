class SanskritTextProcessor:
    """Stub Sanskrit text processor to ensure backend API routes load successfully."""
    
    def __init__(self):
        pass

    def process_text(self, text: str) -> dict:
        return {
            "original_text": text,
            "normalized_text": text,
            "sandhi_split_text": text,
            "segmented_words": [],
            "morphological_analysis": [],
            "compound_analysis": []
        }
