import bcrypt
hash_from_db = b'$2b$12$bOkL4NmPgTaJ4.X.n1Xzae2kA/uOyiiSCyRBDkuSPJ3Ki.3axQXaq'
is_valid = bcrypt.checkpw(b'admin123', hash_from_db)
print(f"Is valid? {is_valid}")
