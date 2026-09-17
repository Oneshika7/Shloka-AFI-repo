docker exec shloka_backend python -c "import urllib.request, json; req = urllib.request.Request('http://127.0.0.1:8000/api/v1/pipeline', data=json.dumps({'text': 'Om bhur bhuva swaha'}).encode('utf-8'), headers={'Content-Type': 'application/json'}); print(urllib.request.urlopen(req).read().decode())"
echo -e "\n--- SECOND RUN ---"
docker exec shloka_backend python -c "import urllib.request, json; req = urllib.request.Request('http://127.0.0.1:8000/api/v1/pipeline', data=json.dumps({'text': 'Om bhur bhuva swaha'}).encode('utf-8'), headers={'Content-Type': 'application/json'}); print(urllib.request.urlopen(req).read().decode())"
echo ""
