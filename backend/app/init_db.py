from models.database import Base, engine
from models.shloka_model import Shloka

# Create all tables
Base.metadata.create_all(bind=engine)
print("Database tables created successfully!")