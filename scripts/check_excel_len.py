import pandas as pd
df = pd.read_excel('/mnt/c/Users/EW0116TU/Downloads/postOCR/postOCR/data/newword.xlsx')
print('Total rows:', len(df))
print('Columns:', df.columns.tolist())
print(df.head())