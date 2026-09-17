import os
import sys

# Add project root to path so we can import app modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import bcrypt

# Setup environment for standalone script
os.environ["DATABASE_URL"] = os.getenv("DATABASE_URL", "postgresql://user:your_password_here@localhost:5432/shloka")

from app.models.user_model import User

salt = bcrypt.gensalt()
hashed_pw = bcrypt.hashpw(b'password123', salt).decode('utf-8')

engine = create_engine(os.environ["DATABASE_URL"])
Session = sessionmaker(bind=engine)
session = Session()

# Create dummy user if doesn't exist
admin = session.query(User).filter_by(email='admin@shloka.afi').first()
if not admin:
    user = User(
        name='Admin User', 
        email='admin@shloka.afi', 
        hashed_password=hashed_pw, 
        organization='SHLOKA-AFI'
    )
    session.add(user)
    session.commit()
    print('Created admin user: admin@shloka.afi / password123')
else:
    print('Admin user already exists')
