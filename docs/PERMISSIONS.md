# Permissions

## Permission table

| What a person does                           | Permission         | Dev | BA  | QA  | PM  | TM  | Why                               |
| -------------------------------------------- | ------------------ | --- | --- | --- | --- | --- | --------------------------------- |
| Read issues                                  | Any signed-in user |     |     |     |     |     | judgment                          |
| Create an issue                              | issue:create       | ✔   | ✔   | ✔   | ✔   | ✔   | Req 3                             |
| Add a comment                                | comment:create     | ✔   | ✔   | ✔   | ✔   | ✔   | Req 5                             |
| Classify an issue                            | issue:classify     |     | ✔   |     |     |     | Req 6                             |
| Close an issue                               | issue:close        |     | ✔   |     |     |     | Req 10                            |
| Assign an issue                              | issue:assign       |     | ✔   |     | ✔   | ✔   | judgment                          |
| Add a test case                              | testCase:create    |     |     | ✔   |     |     | Req 7                             |
| Mark a test case passed or failed            | testCase:setResult |     |     | ✔   |     |     | Req 7                             |
| Log hours worked on an issue                 | timeLog:create     | ✔   |     |     |     |     | Req 8                             |
| Change someone's role                        | user:set-role      |     |     |     |     | ✔   | judgment                          |
| Delete an issue                              | issue:delete       |     |     |     |     |     | Req 10                            |
| Delete a comment                             | comment:deleteAny  |     |     |     |     |     | judgment                          |
| Edit an issue's title, description, or steps | Any signed-in user |     |     |     |     |     | Note — only the author            |
| Change an issue's priority                   | Any signed-in user |     |     |     |     |     | judgment — only the author        |
| Move an issue to open or in-progress         | Any signed-in user |     |     |     |     |     | judgment — only the assigned user |

## Ownership rules

| Action                                       | Who, besides the role                                                                    | Which sentence says so |
| -------------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------- |
| Edit an issue's title, description, or steps | Only the issue's author                                                                  | Note                   |
| Change an issue's priority                   | Only the issue's author                                                                  | judgment               |
| Move an issue to open or in-progress         | Only the assigned user                                                                   | judgment               |
| Assign an issue                              | The person receiving the issue must be a Developer, Business Analyst, or Quality Analyst | Req 4                  |
| Add a test case                              | Only a Quality Analyst assigned to the issue                                             | Req 7 and Note         |
| Mark a test case passed or failed            | Only a Quality Analyst assigned to the issue                                             | Req 7 and Note         |
| Log hours worked                             | Only a Developer assigned to the issue                                                   | Req 8 and Note         |
| Record fix information                       | Only a Developer assigned to the issue                                                   | Req 9 and Note         |

## Gaps and judgment calls

- **Product Manager:** Product Managers can assign issues to team members. This helps organize work and make sure issues are handled by the right people. This is a judgment call because the requirements do not explain what Product Managers can do.

- **Technical Manager:** Technical Managers can assign issues and manage user roles. Only Technical Managers can give someone a role because allowing users to choose their own permissions would be a security risk.

- **Deleting issues:** No role can permanently delete issues. Requirement 10 says issue information must be kept indefinitely. Keeping issues also preserves their history.

- **Assigning issues and deleting comments:** Business Analysts, Product Managers, and Technical Managers can assign issues. No role can delete someone else's comments because we want to preserve the issue's history. Requirement 5 does not specifically allow comment deletion.

- **Changing priority:** Only the person who created an issue can change its priority. This keeps editing permissions consistent with the rule that only the author may edit issue details.

- **Users without roles:** A signed-in user without an assigned role can read issues but cannot create issues, add comments, change roles, or perform other restricted actions. A Technical Manager must assign them a role before they receive those permissions.
