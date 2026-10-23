# TEST RESULTS

| Route              | Body                  | Expected Status | Actual Status | Result |
| ------------------ | --------------------- | --------------: | ------------: | ------ |
| GET /health        | —                     |             200 |           200 | Pass   |
| GET /issues        | —                     |             200 |           200 | Pass   |
| GET /issues/1      | —                     |             200 |           200 | Pass   |
| GET /issues/999    | —                     |             404 |           404 | Pass   |
| POST /issues       | {"title":"New issue"} |             201 |           201 | Pass   |
| POST /issues       | {}                    |             400 |           400 | Pass   |
| PATCH /issues/1    | {"status":"closed"}   |             200 |           200 | Pass   |
| PATCH /issues/999  | {"status":"closed"}   |             404 |           404 | Pass   |
| DELETE /issues/2   | —                     |             204 |           204 | Pass   |
| GET /issues/2      | —                     |             404 |           404 | Pass   |
| DELETE /issues/999 | —                     |             404 |           404 | Pass   |

## Lab 03-03 MongoDB Test Results

| Route                                   | Body                                                                                          | Expected Status | Actual Status | Result |
| --------------------------------------- | --------------------------------------------------------------------------------------------- | --------------: | ------------: | ------ |
| GET /issues                             | —                                                                                             |             200 |           200 | Pass   |
| GET /issues/6ab0327173bd6e350768f8ce    | —                                                                                             |             200 |           200 | Pass   |
| GET /issues/3                           | —                                                                                             |             400 |           400 | Pass   |
| GET /issues/000000000000000000000000    | —                                                                                             |             404 |           404 | Pass   |
| POST /issues                            | {"title":"MongoDB Test Issue","description":"Testing POST for Lab 03-03","priority":"medium"} |             201 |           201 | Pass   |
| PATCH /issues/6ab804ec83f2cfceb76945e1  | {"title":"Updated MongoDB Test Issue","priority":"high"}                                      |             200 |           200 | Pass   |
| DELETE /issues/6ab804ec83f2cfceb76945e1 | —                                                                                             |             204 |           204 | Pass   |
| GET /issues/6ab804ec83f2cfceb76945e1    | —                                                                                             |             404 |           404 | Pass   |

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

| Route                                  | Body                                                                                                                                          | Expected Status | Actual Status | Result |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | --------------: | ------------: | ------ |
| POST /issues                           | {"title":"Module 4 Test Issue","description":"Testing Zod validation","stepsToReproduce":"Create an issue using the API","priority":"medium"} |             201 |           201 | Pass   |
| POST /issues                           | Missing title                                                                                                                                 |             400 |           400 | Pass   |
| POST /issues                           | Includes fake/custom author                                                                                                                   |             201 |           201 | Pass   |
| PATCH /issues/6ac01df40a347287faf5cfa6 | {"priority":"high"}                                                                                                                           |             200 |           200 | Pass   |
| PATCH /issues/6ac01df40a347287faf5cfa6 | {"priority":"urgent"}                                                                                                                         |             400 |           400 | Pass   |

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

## Lab 04-03 Test Results

- POST /issues/:id/comments with a valid comment - PASS
- POST /issues/:id/comments with an empty comment - PASS
- DELETE /issues/:id/comments/:commentId - PASS
- POST /issues/:id/test-cases - PASS
- PATCH /issues/:id/test-cases/:testCaseId - PASS
- npx tsc --noEmit - PASS

## Lab 04-04 Search, Filter, Sort, and Pagination Test Results

- GET /issues?status=open returned only issues with status "open" - PASS
- GET /issues?status=open&priority=high returned only issues matching both filters - PASS
- GET /issues?sort=-createdOn returned issues newest first - PASS
- GET /issues?sort=title returned 400 ValidationFailed - PASS
- GET /issues?q=respond matched an issue where the word appeared only in the description - PASS
- GET /issues?limit=2 returned exactly two issues - PASS
- GET /issues?page=2&limit=2 returned the next page of issues - PASS
- GET /issues?limit=51 returned 400 ValidationFailed - PASS
- Atlas Search index "default" on the issues collection shows Ready - PASS
- Compound index { status: 1, createdOn: -1 } was added to the issues collection - PASS
- npx tsc --noEmit completed with no errors - PASS

## Lab 04-05 Automated Test Results

- npx tsc --noEmit completed with no errors - PASS
- tests/warmup.test.ts - 5 tests passed
- tests/issues.test.ts - 33 tests passed
- Full automated suite - 38 tests passed across 2 test files
- Lab 04-01 validation, author handling, partial update, and ID error handling are now covered by automated tests
- Lab 04-02 status, classification, assignment, and validation are now covered by automated tests
- Lab 04-03 comments and test case functionality are now covered by automated tests
- Lab 04-04 filtering, sorting, validation, pagination, assignedTo filtering, and keyword-search behavior are now covered by automated tests
- Real Atlas keyword search was previously verified with GET /issues?q=respond and remains the manual check that confirms the Atlas Search index is active
- API still runs successfully after splitting src/index.ts into src/app.ts and src/index.ts

## Lab 05-01 Authentication Test Results

| Test                                           | Expected Status | Actual Status | Result |
| ---------------------------------------------- | --------------- | ------------- | ------ |
| GET /health                                    | 200             | 200           | Pass   |
| GET /api/auth/get-session (signed out)         | 200, null       | 200, null     | Pass   |
| POST /api/auth/sign-up/email (valid user)      | 200             | 200           | Pass   |
| GET /api/auth/get-session (signed in)          | 200             | 200           | Pass   |
| POST /api/auth/sign-out                        | 200             | 200           | Pass   |
| GET /api/auth/get-session (after sign-out)     | 200, null       | 200, null     | Pass   |
| POST /api/auth/sign-in/email (valid password)  | 200             | 200           | Pass   |
| POST /api/auth/sign-in/email (wrong password)  | 401             | 401           | Pass   |
| POST /api/auth/sign-up/email (duplicate email) | 422             | 422           | Pass   |
| POST /api/auth/sign-up/email (short password)  | 400             | 400           | Pass   |
| POST /api/auth/sign-in/email (missing Origin)  | 403             | 403           | Pass   |

### Notes

- Installed better-auth version 1.7.7.
- npm audit reported 0 vulnerabilities after fixes.
- Created a test user successfully through Postman.
- Sign-up created a session cookie.
- GET /api/auth/get-session returned the signed-in user's information.
- Sign-out successfully ended the session.
- Signing in again created a new session.
- An incorrect password returned INVALID_EMAIL_OR_PASSWORD.
- A duplicate email returned USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL.
- A short password returned PASSWORD_TOO_SHORT.
- A missing Origin header returned MISSING_OR_NULL_ORIGIN.
- MongoDB automatically created the user, account, and session collections.
- The account collection stores a hashed password instead of plain text.
- The homepage displayed the Issue Tracker welcome message.
- npx tsc --noEmit completed without errors after adding authentication.
- GET / returned 200 and displayed the HTML welcome page while signed out - PASS
- GET / returned 200 and displayed the HTML welcome page while signed in - PASS
- tests/setup.ts successfully mocked authentication for automated tests.
- vitest.config.ts successfully loaded the shared test setup.
- npm test completed successfully - 38 tests passed across 2 files.
- npx tsc --noEmit completed with no errors - PASS
- npm run build completed with no errors - PASS
