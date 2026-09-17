import pandas as pd
try:
    df = pd.read_excel('/mnt/c/Users/EW0116TU/Downloads/postOCR/postOCR/data/newword.xlsx')
    print("Columns:", df.columns.tolist())
    print("First 5 rows:")
    print(df.head())
except Exception as e:
    print(f"Error: {e}")
