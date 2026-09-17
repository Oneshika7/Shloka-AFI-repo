from sqlalchemy import Column, Text, DateTime, String, JSON
from sqlalchemy.sql import func
from pgvector.sqlalchemy import Vector
import uuid
from app.models.database import Base

class Shloka(Base):
    __tablename__ = "shlokas"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    text = Column(Text, nullable=False)
    text_embedding = Column(Vector(384))
    source = Column(Text)
    normalized_text = Column(Text)
    entities = Column(JSON)
    relationships = Column(JSON)
    translation = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<Shloka(id='{self.id}', text='{self.text[:50]}...')>"