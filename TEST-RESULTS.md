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

## Lab 03-03 MongoDB Test Results

| Route | Body | Expected Status | Actual Status | Result |
|---|---|---:|---:|---|
| GET /issues | — | 200 | 200 | Pass |
| GET /issues/6ab0327173bd6e350768f8ce | — | 200 | 200 | Pass |
| GET /issues/3 | — | 400 | 400 | Pass |
| GET /issues/000000000000000000000000 | — | 404 | 404 | Pass |
| POST /issues | {"title":"MongoDB Test Issue","description":"Testing POST for Lab 03-03","priority":"medium"} | 201 | 201 | Pass |
| PATCH /issues/6ab804ec83f2cfceb76945e1 | {"title":"Updated MongoDB Test Issue","priority":"high"} | 200 | 200 | Pass |
| DELETE /issues/6ab804ec83f2cfceb76945e1 | — | 204 | 204 | Pass |
| GET /issues/6ab804ec83f2cfceb76945e1 | — | 404 | 404 | Pass |

### Notes

- GET /issues returned the real issues stored in the MongoDB Atlas issueTracker database.
- Issue IDs now use MongoDB ObjectId values instead of small integer IDs.
- The old-style numeric ID /issues/3 correctly returned 400 Invalid issue id.
- A valid ObjectId that did not match an issue correctly returned 404 Issue not found.
- POST created a new issue with a MongoDB-generated _id.
- PATCH successfully updated the test issue using MongoDB.
- DELETE successfully removed the test issue.
- Data is now stored in MongoDB instead of the old in-memory issues array.

## Lab 04-01 Zod Validation Test Results

| Route | Body | Expected Status | Actual Status | Result |
|---|---|---:|---:|---|
| POST /issues | {"title":"Module 4 Test Issue","description":"Testing Zod validation","stepsToReproduce":"Create an issue using the API","priority":"medium"} | 201 | 201 | Pass |
| POST /issues | Missing title | 400 | 400 | Pass |
| POST /issues | Includes fake/custom author | 201 | 201 | Pass |
| PATCH /issues/6ac01df40a347287faf5cfa6 | {"priority":"high"} | 200 | 200 | Pass |
| PATCH /issues/6ac01df40a347287faf5cfa6 | {"priority":"urgent"} | 400 | 400 | Pass |

### Notes

- Zod validation correctly accepted a valid POST request.
- A POST request missing the required title field returned 400 ValidationFailed.
- A client-supplied author was ignored, and the server used req.user instead.
- PATCH successfully updated only the priority field while keeping the other issue data unchanged.
- An invalid PATCH priority of "urgent" returned 400 ValidationFailed.
- TypeScript compiled successfully with no errors using `npx tsc --noEmit`.

## Lab 04-02 Test Results

- PATCH /issues/:id/status with "in-progress" returned 200 and updated the status.
- PATCH /issues/:id/status with "done" returned 400 ValidationFailed.
- PATCH /issues/:id/classify with "approved" returned 200 and updated the classification.
- PATCH /issues/:id/classify with "pending" returned 400 ValidationFailed.
- PATCH /issues/:id/assign with userId and fullName returned 200 and updated assignedTo.
- PATCH /issues/:id/assign without fullName returned 400 ValidationFailed.
- npx tsc --noEmit completed with no errors.