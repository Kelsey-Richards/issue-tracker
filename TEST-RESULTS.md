# TEST RESULTS

| Route | Body | Expected Status | Actual Status | Result |
|---|---|---:|---:|---|
| GET /health | — | 200 | 200 | Pass |
| GET /issues | — | 200 | 200 | Pass |
| GET /issues/1 | — | 200 | 200 | Pass |
| GET /issues/999 | — | 404 | 404 | Pass |
| POST /issues | {"title":"New issue"} | 201 | 201 | Pass |
| POST /issues | {} | 400 | 400 | Pass |
| PATCH /issues/1 | {"status":"closed"} | 200 | 200 | Pass |
| PATCH /issues/999 | {"status":"closed"} | 404 | 404 | Pass |
| DELETE /issues/2 | — | 204 | 204 | Pass |
| GET /issues/2 | — | 404 | 404 | Pass |
| DELETE /issues/999 | — | 404 | 404 | Pass |