import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
api_key = os.getenv('GROQ_API_KEY')
print('Key exists:', bool(api_key))

client = OpenAI(api_key=api_key, base_url='https://api.groq.com/openai/v1')
try:
    response = client.chat.completions.create(
        model='llama-3.3-70b-versatile',
        messages=[{'role': 'user', 'content': 'test'}],
        temperature=0.2
    )
    print(response)
except Exception as e:
    print('ERROR:', e)
