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

## Lab 05-02 — Protect Your Routes

### Authentication Tests

| Test                                     | Actual Result                 | Status |
| ---------------------------------------- | ----------------------------- | ------ |
| Signed out: GET /issues                  | 401 Unauthorized              | PASS   |
| Signed out: GET /issues/:id              | 401 Unauthorized              | PASS   |
| Signed out: POST /issues                 | 401 Unauthorized              | PASS   |
| Signed out: GET /api/me                  | 401 Unauthorized              | PASS   |
| Public: GET /                            | 200 OK                        | PASS   |
| Public: GET /health                      | 200 OK                        | PASS   |
| Public: GET /api/auth/get-session        | 200 OK, null                  | PASS   |
| Signed in: GET /api/me                   | 200 OK, real user information | PASS   |
| Signed in: GET /issues                   | 200 OK                        | PASS   |
| Signed in: POST /issues with fake author | 201 Created, real author used | PASS   |

### Break-It Tests

| Test                                    | Actual Result                      | Status |
| --------------------------------------- | ---------------------------------- | ------ |
| Access issues after signing out         | 401 Unauthorized                   | PASS   |
| Place requireAuth after issuesRouter    | 200 OK while signed out            | PASS   |
| Restore requireAuth before issuesRouter | 401 Unauthorized                   | PASS   |
| Temporarily restore attachCurrentUser   | Pretend user overwrote real author | PASS   |
| Remove attachCurrentUser again          | Middleware removed                 | PASS   |

### Final Verification

| Test             | Actual Result    | Status |
| ---------------- | ---------------- | ------ |
| npm test         | 42 tests passed  | PASS   |
| npx tsc --noEmit | No errors        | PASS   |
| npm run build    | Build successful | PASS   |

## Lab 05-03 — Roles and Permissions

### Role Setup and Authentication Tests

| Test                                              | Actual Result                 | Status |
| ------------------------------------------------- | ----------------------------- | ------ |
| New user signs up without an assigned role        | Default role is "user"        | PASS   |
| Technical Manager role assigned to Tia in MongoDB | Role updated successfully     | PASS   |
| Tia signs in and checks GET /api/me               | 200 OK, technicalManager role | PASS   |
| Tia assigns Developer role to Eve                 | 200 OK                        | PASS   |
| Tia assigns Business Analyst role to Bo           | 200 OK                        | PASS   |
| Tia assigns Quality Analyst role to Quinn         | 200 OK                        | PASS   |
| Tia assigns Product Manager role to Pat           | 200 OK                        | PASS   |
| Tia tries to assign invalid role "wizard"         | 400 Bad Request               | PASS   |
| Tia tries to change her own role                  | 400 Bad Request               | PASS   |
| Tia tries to change an unknown user's role        | 404 Not Found                 | PASS   |
| Nate signs in without an assigned project role    | 200 OK                        | PASS   |
| Nate accesses GET /issues                         | 200 OK                        | PASS   |
| Nate tries POST /issues                           | 403 Forbidden                 | PASS   |

### Permission Tests

| Test                                       | Actual Result    | Status |
| ------------------------------------------ | ---------------- | ------ |
| Eve (Developer) creates an issue           | 201 Created      | PASS   |
| Eve tries to classify an issue             | 403 Forbidden    | PASS   |
| Bo (Business Analyst) classifies an issue  | 200 OK           | PASS   |
| Eve tries to close an issue                | 403 Forbidden    | PASS   |
| Bo closes an issue                         | 200 OK           | PASS   |
| Eve changes issue status to in-progress    | 200 OK           | PASS   |
| Eve tries to assign an issue               | 403 Forbidden    | PASS   |
| Pat (Product Manager) assigns an issue     | 200 OK           | PASS   |
| Eve tries to add a test case               | 403 Forbidden    | PASS   |
| Quinn (Quality Analyst) adds a test case   | 201 Created      | PASS   |
| Bo tries to update a test case result      | 403 Forbidden    | PASS   |
| Quinn updates a test case result           | 200 OK           | PASS   |
| Pat tries to delete an issue               | 403 Forbidden    | PASS   |
| Tia tries to delete an issue               | 403 Forbidden    | PASS   |
| Nate tries to add a comment                | 403 Forbidden    | PASS   |
| Signed-out user tries to classify an issue | 401 Unauthorized | PASS   |

### Break-It Tests

| Test                                                 | Actual Result                         | Status |
| ---------------------------------------------------- | ------------------------------------- | ------ |
| Misspell "close" as "clsoe" in a permission guard    | TypeScript detected an error (TS2345) | PASS   |
| Restore the correct permission spelling              | TypeScript check passed               | PASS   |
| Temporarily remove the classify permission guard     | Eve classified an issue with 200 OK   | PASS   |
| Restore the classify permission guard                | Eve received 403 Forbidden again      | PASS   |
| Nate tries to promote himself to Technical Manager   | 403 Forbidden                         | PASS   |
| New user tries to sign up with technicalManager role | 400 Bad Request                       | PASS   |
| Quinn updates a test case as Quality Analyst         | 200 OK                                | PASS   |
| Change Quinn's role to Developer in MongoDB          | Role updated successfully             | PASS   |
| Quinn retries without signing in again               | 403 Forbidden                         | PASS   |
| Restore Quinn's Quality Analyst role                 | Role restored successfully            | PASS   |

### Final Verification

| Test                      | Actual Result                  | Status |
| ------------------------- | ------------------------------ | ------ |
| tests/warmup.test.ts      | 5 tests passed                 | PASS   |
| tests/issues.test.ts      | 33 tests passed                | PASS   |
| tests/auth.test.ts        | 4 tests passed                 | PASS   |
| tests/permissions.test.ts | 9 tests passed                 | PASS   |
| npm test                  | 51 tests passed across 4 files | PASS   |
| npx tsc --noEmit          | No TypeScript errors           | PASS   |
| npm run build             | Build successful               | PASS   |

### Notes

- Added five application roles using Better Auth permissions.
- Protected issue routes with role-based permission checks.
- Added a protected route for changing user roles.
- Updated the shared authentication mock for automated tests.
- Added nine new automated permission tests.
- Verified that unauthorized users receive 401 or 403 responses.
- Restored all temporary changes made during security testing.
- All 51 automated tests passed successfully.

## Lab 05-04 — Ownership, Audit Trail, and Going Live

### Automated Tests

- 70 tests passed across 6 test files.
- TypeScript compilation passed.
- npm run build passed.

### Postman Testing

- Eve edits her own issue: 200 OK
- Bo attempts to edit Eve's issue: 403 Forbidden
- Bo attempts to change an unassigned-to-him issue's status: 403 Forbidden
- Eve changes her assigned issue's status: 200 OK
- Bo closes an issue with his Business Analyst permission: 200 OK
- Audit trail records Bo as the person who closed the issue.
- Assignment to Nate (ineligible role): 400 Bad Request
- Assignment to Quinn QA: 200 OK
- Quinn creates a test case: 201 Created
- Quinn updates the test case result: 200 OK
- Quinn creates a comment: 201 Created
- Bo attempts to delete Quinn's comment: 403 Forbidden
- Quinn deletes her own comment: 200 OK

### Break-It Test — Fake Audit Information

- Submitted a request with a forged closedBy value.
- Request returned 200 OK.
- Application ignored the forged identity.
- closedBy and updatedBy correctly showed Bo Analyst.
- closedAt and updatedAt were recorded correctly.

Result: PASSED

## Lab 05-04 — Live Deployment and Final Results

### Google Cloud Run Deployment

Live Service:
https://issue-tracker-855858103219.us-central1.run.app

- Configured BETTER_AUTH_URL.
- Configured CLIENT_ORIGIN.
- Generated a new BETTER_AUTH_SECRET.
- Kept the existing MongoDB connection.
- Cloud Run service update completed successfully.
- GitHub pull request merged into main.
- Google Cloud Build reported successful.

### Live Postman Testing

| Test                             | Actual Result                      |
| -------------------------------- | ---------------------------------- |
| GET /health                      | 200 OK                             |
| GET /issues without signing in   | 401 Unauthorized                   |
| Eve signs in                     | 200 OK                             |
| Secure session cookie name found | __Secure-better-auth.session_token |
| GET /api/me                      | 200 OK                             |
| Nate signs in                    | 200 OK                             |
| Nate attempts to create an issue | 403 Forbidden                      |
| Eve creates a new issue          | 201 Created                        |
| Bo attempts to edit Eve's issue  | 403 Forbidden                      |
| Eve edits her own issue          | 200 OK                             |
| Eve signs out                    | 200 OK                             |
| GET /issues after signing out    | 401 Unauthorized                   |

Live Test Issue ID:
6ae801eeb2df322ef516b2db

### MongoDB Test Account Cleanup

Removed the six temporary test users:
Eve, Bo, Quinn, Pat, Tia, and Nate.

| Collection | Records Deleted |
| ---------- | --------------- |
| session    | 35              |
| account    | 6               |
| user       | 6               |

Cleanup completed successfully.

### Final Automated Tests

- 70 tests passed across 6 test files.
- TypeScript compilation passed.
- Application build passed.
- Ownership and audit trail tests passed.
