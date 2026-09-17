from fastapi import APIRouter, Depends, HTTPException, Request, BackgroundTasks, UploadFile, File
from app.config import limiter
import httpx
import logging
import os
from sqlalchemy.orm import Session
from app.config import NLP_SERVICE_URL, NER_SERVICE_URL, GRAPH_SERVICE_URL, API_SECRET_KEY
from app.models.database import get_db
from app.models.shloka_model import Shloka
from app.agents.orchestrator import AgentOrchestrator
from app.services.translation_service import translation_service
from app.services.graph_service import graph_service
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.api.auth import get_current_user
from app.models.user_model import User

class PipelineRequest(BaseModel):
    text: Optional[str] = None
    source: Optional[str] = None
    image_base64: Optional[str] = None

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/health")
async def health():
    return {"status": "ok", "service": "shloka-afi-main", "version": "0.1.0"}

@router.post("/process")
@limiter.limit("10/minute")
async def process(request: Request, body: dict, current_user: User = Depends(get_current_user)):
    text = body.get("text", "")
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            nlp = await client.post(
                f"{NLP_SERVICE_URL}/api/v1/process",
                json={"text": text}
            )
            nlp_data = nlp.json()
        except Exception as e:
            logger.error(f"NLP service error: {str(e)}")
            raise HTTPException(status_code=503, detail="NLP service unavailable")
        try:
            ner = await client.post(
                f"{NER_SERVICE_URL}/api/v1/extract",
                json={"text": nlp_data.get("normalized_text", text)}
            )
            ner_data = ner.json()
        except Exception as e:
            logger.error(f"NER service error: {str(e)}")
            return {"nlp": nlp_data, "ner": {"entities": [], "relationships": []}}
    return {"nlp": nlp_data, "ner": ner_data}

@router.post("/shlokas")
@limiter.limit("20/minute")
async def create_shloka(request: Request, body: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    text = body.get("text", "")
    source = body.get("source", "")

    # Create new shloka instance
    db_shloka = Shloka(
        text=text,
        source=source
    )

    # Add to database and commit
    db.add(db_shloka)
    db.commit()
    db.refresh(db_shloka)

    return {
        "id": str(db_shloka.id),
        "text": db_shloka.text,
        "source": db_shloka.source,
        "normalized_text": db_shloka.normalized_text,
        "entities": db_shloka.entities,
        "relationships": db_shloka.relationships,
        "translation": db_shloka.translation,
        "created_at": db_shloka.created_at.isoformat() if db_shloka.created_at else None,
        "status": "stored"
    }

@router.get("/shlokas")
@limiter.limit("30/minute")
async def get_shlokas(request: Request, skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    shlokas = db.query(Shloka).order_by(Shloka.created_at.desc()).offset(skip).limit(limit).all()

    result = []
    for shloka in shlokas:
        result.append({
            "id": str(shloka.id),
            "text": shloka.text,
            "source": shloka.source,
            "normalized_text": shloka.normalized_text,
            "entities": shloka.entities,
            "relationships": shloka.relationships,
            "translation": shloka.translation,
            "created_at": shloka.created_at.isoformat() if shloka.created_at else None
        })

    return {
        "shlokas": result,
        "total": len(result),
        "skip": skip,
        "limit": limit
    }


@router.post("/process-and-store")
@limiter.limit("10/minute")
async def process_and_store_shloka(request: Request, body: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Process Sanskrit text through the agent pipeline and store results in database
    Includes translation to English.
    """
    logger.info("ENTERING process_and_store_shloka function")
    text = body.get("text", "")
    source = body.get("source", "")

    # Initialize orchestrator
    orchestrator = AgentOrchestrator()

    # Process the shloka through the agent pipeline
    processing_result = await orchestrator.process_shloka(text)

    # Extract processing results
    normalized_text = processing_result.get("normalized_text", text)
    entities = processing_result.get("entities", [])
    relationships = processing_result.get("relationships", [])

    # Get translation (English)
    translation = None
    if translation_service.is_available():
        try:
            translation = await translation_service.translate_sanskrit_to_english(text)
            logger.info(f"Translation obtained for text '{text[:30]}...': {translation}")
        except Exception as e:
            logger.error(f"Translation failed: {str(e)}")
            translation = None
    else:
        logger.warning("Translation service not available")

    # Create new shloka instance with processing results
    db_shloka = Shloka(
        text=text,
        source=source,
        normalized_text=normalized_text,
        entities=entities,
        relationships=relationships,
        translation=translation
    )

    # Add to database and commit
    db.add(db_shloka)
    db.commit()
    db.refresh(db_shloka)

    # Return stored shloka with processing data
    return {
        "id": str(db_shloka.id),
        "text": db_shloka.text,
        "source": db_shloka.source,
        "normalized_text": db_shloka.normalized_text,
        "entities": db_shloka.entities,
        "relationships": db_shloka.relationships,
        "translation": db_shloka.translation,
        "created_at": db_shloka.created_at.isoformat() if db_shloka.created_at else None,
        "processing_status": processing_result.get("status", "unknown"),
        "processing_errors": processing_result.get("errors", []),
        "graph_build_status": processing_result.get("graph_build_status", "not_attempted")
    }

class TranscribeRequest(BaseModel):
    image_base64: str

@router.post("/transcribe")
@limiter.limit("5/minute")
async def transcribe_image(request: Request, body: TranscribeRequest, current_user: User = Depends(get_current_user)):
    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            response = await client.post(
                f"{NLP_SERVICE_URL}/transcribe",
                json={"image_base64": body.image_base64}
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Transcription service error: {str(e)}")
            raise HTTPException(status_code=503, detail=f"Transcription failed: {str(e)}")

@router.post("/pipeline")
@limiter.limit("10/minute")
async def pipeline(request: Request, body: PipelineRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Process Sanskrit text through P1 (NLP) -> Knowledge Graph pipeline.
    Returns response in the exact format expected by the frontend.
    """
    logger.info("ENTERING pipeline function")

    # Input validation
    text = body.text or ""
    source = body.source or ""
    image_base64 = body.image_base64

    # Check for missing text and image_base64
    if not text and not image_base64:
        raise HTTPException(status_code=400, detail="Either text or image_base64 must be provided")

    # Validate text length
    if text and len(text) > 5000:
        raise HTTPException(status_code=400, detail="Text length must not exceed 5000 characters")

    # --- 🚀 DEDUPLICATION / CACHING LAYER 🚀 ---
    # If the user provided text, check if we've already processed a highly similar shloka
    vector_cache = None
    if text and not image_base64:
        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                embed_res = await client.post(
                    f"{NLP_SERVICE_URL}/embed",
                    json={"text": text}
                )
                if embed_res.status_code == 200:
                    vector_cache = embed_res.json().get("vector")
                    
                    if vector_cache:
                        # Semantic search for >95% similarity (cosine distance < 0.05)
                        existing_shloka = db.query(Shloka).filter(
                            Shloka.text_embedding.is_not(None),
                            Shloka.text_embedding.cosine_distance(vector_cache) < 0.05
                        ).first()
                        
                        if existing_shloka:
                            logger.info(f"Fuzzy Cache hit: Semantically similar Shloka found in DB (ID: {existing_shloka.id}). Skipping NLP pipeline.")
                            return {
                                "shloka_id": str(existing_shloka.id),
                                "original_text": existing_shloka.text,
                                "translation": existing_shloka.translation,
                                "confidence": 0.99,  # High confidence since it's verified/cached
                                "entities": existing_shloka.entities,
                                "relationships": existing_shloka.relationships,
                                "full_analysis": {
                                    "cached": True,
                                    "message": "Retrieved from database to prevent redundancy",
                                    "transcribed_text": existing_shloka.text,
                                    "translation": existing_shloka.translation
                                }
                            }
            except Exception as e:
                logger.error(f"Fuzzy cache check failed: {e}")

    # Initialize HTTP client with extended timeout for initial startup
    async with httpx.AsyncClient(timeout=300.0) as client:
        try:
            # Step 1: Call P1 (Sanskrit Processor) service /analyze
            logger.info(f"Calling P1 NLP service /analyze for text: {text[:50]}...")
            
            payload = {
                "top_k": 5,
                "target_language": "English"
            }
            if image_base64:
                payload["image_base64"] = image_base64
            else:
                payload["shloka"] = text
                
            p1_response = await client.post(
                f"{NLP_SERVICE_URL}/analyze",
                json=payload
            )
            p1_response.raise_for_status()
            p1_data = p1_response.json()

            logger.info(f"P1 service succeeded. Received analysis data.")

        except Exception as e:
            logger.error(f"P1 service error: {str(e)}")
            raise HTTPException(status_code=503, detail=f"Sanskrit processing service unavailable: {str(e)}")

        # Step 2: Map P1 detailed data to Graph entities and relationships
        mapped_entities = []
        p1_relationships = []
        
        confidence = p1_data.get("confidence", 0.85)
        
        # Helper to add entity matching the frontend format
        def add_entity(name, ent_type, definition=""):
            if name and isinstance(name, str):
                name = name.strip()
            if name and not any(e.get("name") == name for e in mapped_entities):
                mapped_entities.append({
                    "name": name,
                    "type": ent_type,
                    "definition": definition,
                    "confidence": confidence
                })

        # Ingredients (maps to Herb/Ingredient)
        ingredients = p1_data.get("ingredients", [])
        if not ingredients and p1_data.get("herbs"):
             ingredients = [{"name": h} for h in p1_data.get("herbs")]
             
        for ing in ingredients:
            ing_name = ing.get("sanskrit_name") or ing.get("common_name") or ing.get("name")
            if ing_name:
                add_entity(ing_name, "Herb", ing.get("botanical_name", ""))
            
        # Doshas
        doshas = p1_data.get("doshas", [])
        for dosha in doshas:
            add_entity(dosha, "Dosha", "Ayurvedic body humor")
            # Connect ingredients to doshas
            for ing in ingredients:
                ing_name = ing.get("sanskrit_name") or ing.get("common_name") or ing.get("name")
                if ing_name:
                    p1_relationships.append({
                        "source": ing_name,
                        "target": dosha,
                        "type": "BALANCES",
                        "confidence": confidence
                    })
                
        # Diseases (Roga)
        diseases = p1_data.get("diseases", [])
        for disease in diseases:
            add_entity(disease, "Disease", "Disease condition")
            # Connect ingredients to diseases
            for ing in ingredients:
                ing_name = ing.get("sanskrit_name") or ing.get("common_name") or ing.get("name")
                if ing_name:
                    p1_relationships.append({
                        "source": ing_name,
                        "target": disease,
                        "type": "TREATS",
                        "confidence": confidence
                    })

        # Actions (Karma)
        actions = p1_data.get("actions", [])
        for action in actions:
            add_entity(action, "Karma", "Therapeutic Action")

        # Rasa
        rasas = p1_data.get("rasa", [])
        if isinstance(rasas, str): rasas = [rasas]
        for rasa in rasas:
            add_entity(rasa, "Rasa", "Taste")

        # Write to Neo4j directly
        import uuid
        raw_uuid = uuid.uuid4()
        shloka_id = str(raw_uuid)
        
        if graph_service.is_available():
            background_tasks.add_task(
                graph_service.write_shloka,
                shloka_id=shloka_id,
                text=p1_data.get("transcribed_text") or text,
                translation=p1_data.get("translation", ""),
                entities=mapped_entities,
                relationships=p1_relationships
            )

        # Store to SQL Database so Insights Center can fetch it
        try:
            db_shloka = Shloka(
                id=raw_uuid,
                text=p1_data.get("transcribed_text") or text,
                source=source,
                normalized_text="",
                entities=mapped_entities,
                relationships=p1_relationships,
                translation=p1_data.get("translation", ""),
                text_embedding=vector_cache if not image_base64 else None
            )
            db.add(db_shloka)
            db.commit()
        except Exception as e:
            logger.error(f"Failed to store in SQL database: {e}")
            db.rollback()

        # Step 3: Return response to the frontend
        # Pass the full p1_data as well as the mapped entities and relationships
        return {
            "shloka_id": shloka_id,
            "original_text": p1_data.get("transcribed_text") or text,
            "translation": p1_data.get("translation", ""),
            "confidence": confidence,
            "entities": mapped_entities,
            "relationships": p1_relationships,
            "full_analysis": p1_data
        }

import csv
import io
import PyPDF2

@router.post("/bulk-upload")
@limiter.limit("5/minute")
async def bulk_upload(
    request: Request,
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks(),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Process multiple shlokas from a CSV or PDF file.
    """
    logger.info(f"ENTERING bulk_upload function with file: {file.filename} by user {current_user.email}")
    
    # 1. MIME Type Validation
    valid_mime_types = ["text/csv", "application/pdf", "application/vnd.ms-excel", "text/plain"]
    if file.content_type not in valid_mime_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Only CSV and PDF are supported.")
        
    if not file.filename.lower().endswith(('.csv', '.pdf')):
        raise HTTPException(status_code=400, detail="Only .csv and .pdf files are supported")
        
    # 2. File Size Validation (Max 5MB)
    MAX_FILE_SIZE = 5 * 1024 * 1024
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 5MB.")
        
    shlokas_to_process = []
    
    if file.filename.endswith('.csv'):
        # Process CSV
        csv_reader = csv.reader(io.StringIO(content.decode("utf-8")))
        for row in csv_reader:
            if row:
                longest_cell = max(row, key=len).strip()
                if longest_cell and len(longest_cell) > 10:
                    shlokas_to_process.append(longest_cell)
                    
    elif file.filename.endswith('.pdf'):
        # Process PDF
        try:
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
            full_text = ""
            for page in pdf_reader.pages:
                page_text = page.extract_text()
                if page_text:
                    full_text += page_text + " "
                    
            chunks = full_text.replace('॥', '।').split('।')
            for chunk in chunks:
                clean_chunk = chunk.strip()
                if clean_chunk and len(clean_chunk) > 10:
                    shlokas_to_process.append(clean_chunk + "।")
        except Exception as e:
            logger.error(f"Failed to parse PDF: {e}")
            raise HTTPException(status_code=400, detail=f"Failed to parse PDF: {str(e)}")

    logger.info(f"Found {len(shlokas_to_process)} shlokas to process")
    
    results = []
    success_count = 0
    
    for text in shlokas_to_process[:20]:
        try:
            req = PipelineRequest(text=text, source=file.filename)
            res = await pipeline(request, req, background_tasks, db)
            results.append(res)
            success_count += 1
        except Exception as e:
            logger.error(f"Failed to process shloka: {e}")
            
    return {
        "status": "success",
        "message": f"Processed {success_count} shlokas from {file.filename}",
        "total_found": len(shlokas_to_process),
        "results": results
    }


@router.get("/graph/stats")
async def get_graph_stats(current_user: User = Depends(get_current_user)):
    """
    Direct endpoint to Neo4j graph service's stats.
    Returns graph statistics in the format expected by the frontend.
    """
    return graph_service.get_stats()

@router.get("/graph/full")
async def get_full_graph(current_user: User = Depends(get_current_user)):
    """
    Direct endpoint to Neo4j graph service's full graph.
    Returns the full graph in the format expected by the frontend.
    """
    return graph_service.get_full_graph()

@router.get("/graph/visualize/{shloka_id}")
async def get_shloka_graph(shloka_id: str, current_user: User = Depends(get_current_user)):
    """
    Direct endpoint to Neo4j graph service's subgraph for a shloka.
    Returns the subgraph in the format expected by the frontend.
    """
    return graph_service.get_shloka_subgraph(shloka_id)

@router.get("/graph/entity/{name}")
async def get_entity(name: str, current_user: User = Depends(get_current_user)):
    result = graph_service.get_entity(name)
    if not result:
        raise HTTPException(status_code=404, detail=f"Entity '{name}' not found")
    return result

# ────────────────────────────────────────────────
# Dictionary endpoints
# ────────────────────────────────────────────────
import json
from datetime import datetime, timezone
from pathlib import Path

DICT_PATH = Path(__file__).resolve().parent.parent.parent / "services" / "sanskrit_processor" / "data" / "ayurveda_dictionary.json"

class DictionaryUploadRequest(BaseModel):
    dictionary: List[Dict[str, Any]]

@router.get("/dictionary")
async def get_dictionary(current_user: User = Depends(get_current_user)):
    """Return info about the current certified dictionary."""
    try:
        if not DICT_PATH.exists():
            return {"count": 0, "last_updated": "Never", "terms": []}
        data = json.loads(DICT_PATH.read_text(encoding="utf-8"))
        stat = DICT_PATH.stat()
        last_updated = datetime.fromtimestamp(stat.st_mtime, tz=timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
        return {"count": len(data), "last_updated": last_updated, "terms": data[:10]}  # preview first 10
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read dictionary: {e}")

@router.post("/dictionary/upload")
async def upload_dictionary(request: DictionaryUploadRequest, current_user: User = Depends(get_current_user)):
    """Replace the certified Ayurvedic dictionary used for shloka transliteration grounding."""
    try:
        if not request.dictionary or len(request.dictionary) == 0:
            raise HTTPException(status_code=400, detail="Dictionary is empty.")
        # Backup the old one
        if DICT_PATH.exists():
            backup_path = DICT_PATH.with_suffix(".json.backup")
            backup_path.write_text(DICT_PATH.read_text(encoding="utf-8"), encoding="utf-8")
        # Write new dictionary
        DICT_PATH.parent.mkdir(parents=True, exist_ok=True)
        DICT_PATH.write_text(json.dumps(request.dictionary, ensure_ascii=False, indent=2), encoding="utf-8")
        logger.info(f"Dictionary updated: {len(request.dictionary)} terms written to {DICT_PATH}")
        return {
            "status": "success",
            "message": f"Dictionary updated with {len(request.dictionary)} terms.",
            "count": len(request.dictionary),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update dictionary: {e}")

# ────────────────────────────────────────────────
# User endpoints
# ────────────────────────────────────────────────
from app.models.user_model import User

class UserRequest(BaseModel):
    name: str
    email: Optional[str] = None
    organization: Optional[str] = None
    theme: Optional[str] = "dark"

@router.get("/users")
async def get_users(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    users = db.query(User).all()
    return {"users": [{"id": u.id, "name": u.name, "email": u.email, "organization": u.organization, "theme": u.theme} for u in users]}

@router.post("/users")
async def create_user(request: UserRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user = User(
        name=request.name,
        email=request.email,
        organization=request.organization,
        theme=request.theme
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"id": user.id, "name": user.name, "email": user.email, "organization": user.organization, "theme": user.theme}

@router.put("/users/{user_id}")
async def update_user(user_id: str, request: UserRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.name = request.name
    user.email = request.email
    user.organization = request.organization
    if request.theme:
        user.theme = request.theme
    db.commit()
    db.refresh(user)
    return {"id": user.id, "name": user.name, "email": user.email, "organization": user.organization, "theme": user.theme}