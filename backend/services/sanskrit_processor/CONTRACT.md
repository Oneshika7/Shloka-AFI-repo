# Sanskrit NLP + NER Service Contract

This document specifies the request and response shapes for the Sanskrit Normalization and Dictionary-Driven NER microservice.

---

## 1. Health Check
Checks the service health status.

### Endpoint
*   **Method**: `GET`
*   **Path**: `/health` (Legacy path `/api/v1/health` is also supported)

### Response Shape
`application/json`
```json
{
  "status": "healthy",
  "service": "sanskrit-nlp",
  "version": "0.1.0"
}
```

---

## 2. Sanskrit Normalization Service
Applies Unicode NFKC normalization and converts Devanagari to IAST transliteration.

### Endpoint
*   **Method**: `POST`
*   **Path**: `/normalize`

### Request Shape
`application/json`
```json
{
  "text": "अश्वगन्धा"
}
```

### Response Shape
`application/json`
```json
{
  "original": "अश्वगन्धा",
  "normalized": "अश्वगन्धा",
  "iast": "aśvagandhā"
}
```

---

## 3. Dictionary-Driven NER Service
Extracts Ayurvedic entities from text using PhraseMatcher and Sandhi compound substring fallbacks.

### Endpoint
*   **Method**: `POST`
*   **Path**: `/extract-entities`

### Request Shape
`application/json`
```json
{
  "text": "अश्वगन्धाम् सेवते snigdha वातकफशामिनी च।",
  "iast": "aśvagandhām sevate snigdha vātakaphaśāminī ca."
}
```

### Response Shape
`application/json`
```json
{
  "entities": [
    {
      "term": "Ashwagandha",
      "devanagari": "अश्वगन्धा",
      "category": "dravya",
      "definition": "An adaptogenic herb (Withania somnifera) widely used to promote strength, reduce stress, and improve overall vitality.",
      "confidence": 0.85,
      "span_start": 0,
      "span_end": 11,
      "match_type": "normalized"
    },
    {
      "term": "Snigdha",
      "devanagari": "स्निग्ध",
      "category": "guna",
      "definition": "Oily or unctuous quality; lubricates tissues, increases Kapha, and pacifies Vata and Pitta.",
      "confidence": 0.85,
      "span_start": 18,
      "span_end": 25,
      "match_type": "normalized"
    },
    {
      "term": "Vata",
      "devanagari": "वात",
      "category": "dosha",
      "definition": "The biological air and space humor; responsible for all movement, nerve impulses, and circulation in the body.",
      "confidence": 0.75,
      "span_start": 26,
      "span_end": 29,
      "match_type": "substring"
    },
    {
      "term": "Kapha",
      "devanagari": "कफ",
      "category": "dosha",
      "definition": "The biological water and earth humor; responsible for structure, lubrication, stability, and cohesion.",
      "confidence": 0.75,
      "span_start": 29,
      "span_end": 31,
      "match_type": "substring"
    }
  ]
}
```

### Match Types and Confidence Scores
1.  `exact` (confidence: `1.0`): The dictionary headword matches exactly as a token or sequence of tokens in the text.
2.  `normalized` (confidence: `0.85`): The token matches the dictionary headword after case-insensitivity lowercasing, diacritic stripping, and Sanskrit vibhakti/suffix stemming (visarga, anusvara, and halanta endings).
3.  `substring` (confidence: `0.75`): The dictionary headword appears as a substring of a larger Sanskrit compound word (Sandhi handling, minimum 4 characters).
