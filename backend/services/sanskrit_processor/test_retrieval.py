from retrieval import retrieve_context
try:
    print(retrieve_context('Vata pitta kapha'))
except Exception as e:
    print('ERROR:', e)
