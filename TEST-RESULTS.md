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

## Lab 5.5-01 — AI Triage Assistant Test Results

### Setup and Verification

- Installed AI SDK and Groq packages successfully.
- Created Groq API key and configured .env.
- First AI agent successfully used the get_time tool.
- npx tsc --noEmit completed with no errors - PASS
- npm run build completed successfully - PASS

### Postman Testing

- POST /issues created a test issue - 201 Created - PASS
- POST /triage returned an AI suggestion - 200 OK - PASS
- AI classified the issue as "duplicate".
- AI suggested "medium" priority.
- AI reason: "Same misalignment issue reported".
- AI returned duplicateOf: 6add86cac59fd4694f6cc52d
- GET /issues/:id confirmed the suggested ID exists - 200 OK - PASS

### Notes

- The AI found an older issue titled "Login button misaligned".
- The suggested ID matched the older issue, not the new test issue.
- The AI response matched the required Zod schema.
- The AI successfully searched existing issues and returned a suggestion.

### Manual Break-It Tests

- Signed-out user received 401 Unauthorized - PASS
- Prompt injection returned a valid AI suggestion with 200 OK - PASS
- GET /issues confirmed existing issue information remained unchanged.
- Invalid Groq model returned 500 Internal Server Error - PASS
- Two requests sent close together both returned 200 OK - PASS
- Empty request body returned 400 Bad Request - PASS
- Description over 1,500 characters returned 400 Bad Request - PASS
- Restored the correct Groq model after testing.

### Automated Break-It Tests

- Removed regex escaping: "escapes the model's words before they reach the database" failed. Put back, tests green.
- Changed MAX_SEARCH_STEPS from 3 to 10: "stops after 3 search trips instead of looping forever" failed. Put back, tests green.
- Removed issue tags: "puts the user's text in issue tags, not the system prompt" failed. Put back, tests green.
- Removed requireAuth: "is 401 when signed out, and never calls the assistant" failed. Put back, tests green.
- Changed 502 to 500: Both "answers 502" tests failed. Put back, tests green.

### Final Automated Test Results

- tests/triageAgent.test.ts - 9 tests passed
- tests/triage.test.ts - 8 tests passed
- Full test suite - 87 tests passed across 8 files - PASS
- All five intentional break-it tests completed successfully.
- All original code restored.

## Lab 06-02 — Part 1 Test Results

### Automated Tests

- 4 test files passed.
- 31 of 31 tests passed.
- TypeScript check completed without errors.

### Manual Browser Testing

- Signed out: "Please sign in first" displayed correctly.
- Signed in: All 14 issues loaded from MongoDB.
- Network tab: Two GET /issues requests appeared in development.
- API stopped: "Request failed (502)" displayed correctly.
- API restarted: Signed back in and all 14 issues loaded again.

### Result

Part 1 passed all automated tests and manual browser checks.

## Lab 06-02 — Part 2 Test Results

### Automated Tests

- Frontend: 63 tests passed across 8 test files — PASS
- Backend: 87 tests passed across 8 test files — PASS
- Updated the backend Vitest configuration to run only backend tests.
- Frontend and backend test suites now run separately without errors.

### Manual Browser Testing

- Created "Testing React Add Issue" using the React form — PASS
- Issue count increased from 14 to 15 — PASS
- Attempted to change an unassigned issue's status and received 403 — PASS
- Assigned the issue to Eve Dev using Tia Tech — PASS
- Eve changed the issue status from open to in-progress — PASS
- Refreshed the page and confirmed the status remained in-progress — PASS
- Clicked Delete, then Cancel; the issue remained — PASS
- Attempted deletion without permission and received 403 — PASS
- Temporarily added issue:delete permission to technicalManager to test successful deletion, then restored the original permissions — PASS
- Tia successfully deleted the test issue after rebuilding the backend — PASS
- Issue count decreased from 15 to 14 — PASS
- Submitted the Add Issue form with empty required fields; all three validation messages appeared — PASS
- Confirmed an invalid form did not send a POST /issues request — PASS

### Result

Part 2 passed all 63 frontend tests and manual create, status update, validation, and delete checks. The backend also passed all 87 automated tests.

## Lab 06-02 — Part 3 Test Results

### React Router Browser Testing

- View button opened the Edit page with existing issue information — PASS
- Editing an issue created by another user returned 403 — PASS
- Editing an issue created by the signed-in user saved successfully — PASS
- Refreshing the Edit page kept the issue information — PASS
- Invalid URL displayed the Not Found page — PASS

### Express Fallback Testing

- Built React frontend loaded through Express on port 3000 — PASS
- Refreshing /edit/:id with the fallback enabled worked — PASS
- Commenting out the fallback caused Cannot GET /edit/:id — PASS
- Restored the fallback, rebuilt, and confirmed the Edit page loaded again — PASS

### Lab 06-02 — Break-It Test #1: API Error Handling

- Changed `if (!res.ok)` to `if (false)` in `frontend/src/api.ts`.
- Result: 10 tests failed across 5 test files.
- The application failed to handle API errors correctly.
- Restored `if (!res.ok)`.
- Ran the tests again: 74 tests passed across 9 files.
- Result: PASS — Automated tests detected the intentional mistake.

### Lab 06-02 — Break-It Test #2: Delete List Update

- Temporarily removed `replaceIssues` from `handleDelete` in `frontend/src/pages/IssueListPage.tsx`.
- Result: 1 test failed and 73 passed.
- Failing test: `deletes an issue after the person confirms`.
- The test expected the issue count to change from 4 to 3, but the screen still showed 4 issues.
- Restored the original `replaceIssues` code.
- Ran tests again: 74 passed across 9 test files.
- Result: PASS — Automated tests detected the missing list update.

### Lab 06-02 — Break-It Test #3: React Router

- Temporarily changed the Edit page route from `/edit/:id` to `/issues/:id` in `frontend/src/App.tsx`.
- Also changed the navigation path to `/issues/:id`.
- Result: 7 tests failed and 67 passed.
- All 7 failures occurred in `App.test.tsx`.
- Tests detected that `/edit/:id` no longer worked and that `/issues/:id` was incorrectly being used as a frontend route.
- Restored both original `/edit/:id` paths.
- Ran tests again: 74 passed across 9 test files.
- Result: PASS — Automated tests detected the incorrect React Router paths.

### Lab 06-02 — Break-It Test #4: Wrong Issue ID

- Temporarily changed `issue._id` to `issue.id` in `frontend/src/components/IssueCard.tsx`.
- TypeScript detected error TS2339 because `id` does not exist on the Issue type.
- Result: 3 tests failed and 71 passed.
- The View button passed `undefined` instead of the correct issue ID.
- Restored the original `issue._id` property.
- Ran tests again: 74 passed across 9 test files.
- Ran the TypeScript checker again: no errors.
- Result: PASS — TypeScript and automated tests detected the incorrect property.

### Lab 06-02 — Break-It Test #5: Form Submission

- Temporarily removed `e.preventDefault()` from `frontend/src/components/AddIssueForm.tsx`.
- Result: All 74 automated tests still passed.
- The terminal displayed warnings: `Not implemented: HTMLFormElement's requestSubmit() method`.
- Without `e.preventDefault()`, a real browser may reload the page during form submission.
- Restored the original `e.preventDefault()` line.
- Ran tests again: 74 passed across 9 test files.
- The `requestSubmit()` warnings disappeared.
- Result: Automated tests did not catch the mistake, demonstrating why browser testing is also important.

## Lab 06-03 — Responsive Layout Test

On desktop, my Issue Tracker displayed two columns of styled issue cards with the navigation beside the title. On mobile, the cards stacked into one column and the navigation moved below the title. Everything fit on the smaller screen.

## Lab 06-03 — Break-It Tests

### Test 1 — Remove Tailwind Import

- **Change:** Temporarily removed `@import "tailwindcss";` from `frontend/src/index.css`.
- **Browser result:** BugHive lost its card borders, grid layout, button styling, and spacing. The issues appeared in a long vertical list.
- **Automated tests:** All 76 tests passed across 9 test files.
- **Conclusion:** Automated tests did not detect the visual styling problems.

### Test 2 — Remove Vite Import Alias

- **Change:** Temporarily removed the `resolve.alias` section from `frontend/vite.config.ts`.
- **Result:** 7 test files failed to start, 2 passed, and 12 individual tests passed.
- **Errors:** Vite could not resolve imports such as `@/components/ui/field`, `@/lib/utils`, and `@/components/ui/card`.
- **Conclusion:** Vite needs the `@` alias to find our frontend components. My results differed slightly from the professor's example, which reported 6 failing files.

### Test 3 — Remove TypeScript Import Alias

- **Change:** Temporarily removed the `"paths"` setting from `frontend/tsconfig.app.json`.
- **TypeScript result:** 14 errors across 5 files, mostly TS2307 errors about missing `@/` imports, plus one TS7006 error.
- **Automated tests:** All 76 tests passed across 9 test files.
- **Conclusion:** Vite could still resolve the imports, but TypeScript could not. Both tools need their own alias configuration.

### Test 4 — Remove Trim from Form Validation

- **Change:** Temporarily removed the three `.trim()` calls from the resolver in `AddIssueForm.tsx`.
- **Result:** 74 tests passed and 2 failed across 9 test files.
- **Failed tests:** `treats spaces only as empty` and `calls onAdd with trimmed text and the chosen priority`.
- **Conclusion:** Without `.trim()`, the form accepts spaces as text and sends values with unnecessary spaces to the API.

### Test 5 — Remove Server Field Error Loop

- **Change:** Temporarily removed the `for (const detail of err.details)` loop from `AddIssueForm.tsx`.
- **Result:** 75 tests passed and 1 failed across 9 test files.
- **Failed test:** `puts the SERVER's field problems next to the right boxes (the server checks again)`.
- **Conclusion:** Without the loop, server validation errors appear at the bottom of the form instead of beside the correct input fields.

### Test 6 — Disconnect Title Input from React Hook Form

- **Change:** Temporarily removed `{...field}` from the Title input in `AddIssueForm.tsx`.
- **Result:** 60 tests passed and 16 failed across 9 test files.
- **Failed files:** `AddIssueForm.test.tsx` (9 failures), `IssueListPage.actions.test.tsx` (4 failures), and `App.test.tsx` (3 failures).
- **Conclusion:** Without `{...field}`, React Hook Form cannot track the Title input. The form treats the title as empty, preventing issues from being added or edited correctly.

## Lab 06-03 — Manual Browser Tests

1. **Empty form:** Submitted the form with empty fields. Validation messages appeared next to the required fields.
2. **Spaces-only title:** Entered only spaces in the Title field. The form correctly rejected the title.
3. **Correcting errors:** Entered valid text after a validation error. The error message disappeared.
4. **Adding an issue:** Submitted a valid issue. The new issue appeared in the list, and the form cleared.
5. **Editing an issue:** Clicked View on an existing issue. The edit form loaded the issue's information, and Save changes worked.

All five browser tests passed.

## Final Checks

- `npm test` — 76 tests passed across 9 test files.
- `npx tsc --noEmit -p tsconfig.app.json` — No TypeScript errors.
- `npm run build` — Production build succeeded.

## Shared Zod Schema Test

- **Change:** Temporarily changed the Title validation message in `src/schemas/issueSchemas.ts` from "title is required" to "Please give the issue a title".
- **Result:** The new validation message appeared in the frontend form.
- **Conclusion:** The frontend and backend use the same Zod schema, so validation rules only need to be updated in one place.
- **Restored:** Changed the validation message back to "title is required" after testing.

**Status:** Passed.
