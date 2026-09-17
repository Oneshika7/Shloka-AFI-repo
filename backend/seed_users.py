import requests

res = requests.post("http://localhost:8002/api/v1/users", json={
    "name": "Dr. Payal Dev",
    "email": "payal@shloka-afi.org",
    "organization": "Vedic NLP Consortium",
    "theme": "dark"
})
print("User 1:", res.status_code, res.text)

res2 = requests.post("http://localhost:8002/api/v1/users", json={
    "name": "Guest Researcher",
    "email": "guest@shloka-afi.org",
    "organization": "Open Access",
    "theme": "light"
})
print("User 2:", res2.status_code, res2.text)
