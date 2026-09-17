import urllib.request, json

req = urllib.request.Request(
    'http://127.0.0.1:8002/api/v1/pipeline',
    data=json.dumps({'text': 'Om bhur bhuva swaha'}).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)
res1 = urllib.request.urlopen(req).read().decode()
print("FIRST RUN:", res1)

print("\n--- SECOND RUN ---\n")

res2 = urllib.request.urlopen(req).read().decode()
print("SECOND RUN:", res2)
