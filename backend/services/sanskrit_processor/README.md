# Sanskrit Processor Service

**Owner**: P1 Team (Sanskrit/NLP Specialists)

This service handles the core Sanskrit text processing pipeline. It performs:
- Text normalization and preprocessing
- Entity recognition (herbs, doshas, ingredients)
- Relationship extraction between entities
- Confidence scoring for extractions

The service can operate in two modes:
1. RAG-based (current default) - uses vector similarity with Ayurvedic corpus
2. Dictionary-driven (in development) - uses exact term matching with curated glossary

## Responsibilities
- Accept raw Sanskrit shloka text
- Return structured entities and relationships
- Maintain processing confidence metrics
- Handle both text and image-based input (via OCR integration)

## Current Status
- Dictionary-based matcher implemented (Phase 1 & 2 complete)
- A/B testing framework in place
- Preparing for real dictionary integration
