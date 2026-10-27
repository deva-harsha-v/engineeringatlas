# Engineering Atlas - QA Audit Report

## Executive Summary

This Quality Assurance (QA) Audit Report provides a comprehensive functional and technical assessment of **Engineering Atlas** — an academic visual-learning platform for engineering students and faculty.

The testing was conducted locally across all core portals (Student, Faculty, and Admin), API endpoints, authentication workflows, navigation structures, and automated verification suites. The primary objective was to identify broken functionality, authentication flow issues, authorization functional gaps, API validation/error handling edge cases, mobile responsiveness failures, and data consistency issues without performing security exploitation.

---

## Test Environment & Scope

- **Application Target**: Engineering Atlas (Next.js 14 App Router, TypeScript, React 18, Tailwind CSS, Local JSON Atomic Store persistence)
- **Local Server**: Running at `http://localhost:3000`
- **Scope**:
  - Authentication & Session Management (`/api/auth/*`, Login flows)
  - Student Portal & Academic Context Isolation (`/student/*`, `/api/subjects`, `/api/materials`, `/api/assignments`, `/api/atlas`, `/api/papers`, `/api/questions`)
  - Faculty Portal & Course Management (`/faculty/*`, `/api/faculty/*`)
  - Admin Portal & Institutional Management (`/admin/*`, `/api/admin/*`, `/api/academic/structure`)
  - API Verification & Boundary Input Handling (`/api/*`)
  - Automated E2E & Responsive Test Suites (`scripts/verify-*.js`, `scripts/qa-api-test.js`)

---

## Summary of QA Audit Findings

| Category | High Severity | Medium Severity | Low / Info | Total Findings |
| :--- | :---: | :---: | :---: | :---: |
| **Authentication & Session Handling** | 1 | 1 | 0 | 2 |
| **Authorization & Access Control** | 1 | 0 | 0 | 1 |
| **API Endpoints & Input Handling** | 1 | 2 | 1 | 4 |
| **Automated Verification Suites** | 0 | 2 | 1 | 3 |
| **Responsive UI & Navigation** | 0 | 1 | 1 | 2 |
| **Total** | **3** | **6** | **3** | **12** |

---

## Detailed QA Findings & Reproducible Failures

---

### Category 1: Authorization & Access Control

#### Finding QA-01: Unprotected Academic Structure Mutation Endpoints
- **Severity**: HIGH
- **Category**: Authorization / API Security
- **Affected Route**: `POST /api/academic/structure` & `DELETE /api/academic/structure`
- **Description**: The `/api/academic/structure` API route handles critical administrative actions (`CREATE_BRANCH`, `DELETE_BRANCH`, `CREATE_SECTION`, `DELETE_SECTION`, `CREATE_SUBJECT`, `DELETE_SUBJECT`). However, the `POST` and `DELETE` route handlers do not execute role verification (`requireRole(req, ['ADMIN'])`). Unauthenticated users or non-admin accounts (such as faculty or student sessions) can invoke structure mutation actions and modify or delete academic branches, subjects, and sections.
- **Impact**: Non-administrative users or unauthorized API calls can delete or alter institutional academic structures, leading to system-wide data corruption or denial of access to academic materials.
- **Steps to Reproduce**:
  1. Send an HTTP POST request to `http://localhost:3000/api/academic/structure` without any authentication cookie:
     ```json
     {
       "action": "CREATE_BRANCH",
       "name": "Unauthorized Test Branch",
       "code": "UTB"
     }
     ```
  2. Observe that the API returns HTTP 200 OK with `{"success": true, "data": ...}` and creates the branch in the store instead of rejecting the request with HTTP 401 or HTTP 403.

---

### Category 2: Authentication & Session Management

#### Finding QA-02: Missing Forced Password Reset Flow for Bulk-Provisioned Faculty
- **Severity**: HIGH
- **Category**: Authentication Flow / Password Policy
- **Affected Files**: `src/app/api/auth/login/route.ts`, `src/app/login/page.tsx`, `src/app/api/faculty/bulk/route.ts`
- **Description**: When bulk-provisioning faculty via `POST /api/faculty/bulk`, user records are correctly created with `mustChangePassword: true`. However, when a newly provisioned faculty member logs in via `/api/auth/login`, the login endpoint returns a valid session cookie without enforcing or redirecting the user to a mandatory password update workflow. The user can continue operating with the default assigned password (`password123`) indefinitely.
- **Impact**: Newly provisioned faculty members remain on default predictable initial passwords, exposing faculty accounts to unauthorized access if default passwords are not changed.
- **Steps to Reproduce**:
  1. Provision a new faculty member via `POST /api/faculty/bulk` with `mustChangePassword: true`.
  2. Authenticate using the newly created faculty email and default password at `/login`.
  3. Observe that authentication succeeds and the user is immediately redirected to `/faculty` without a prompt or forced interface to change their password.

#### Finding QA-03: Inconsistent Auth Logout Session Cookie Invalidation
- **Severity**: MEDIUM
- **Category**: Session Management
- **Affected Route**: `POST /api/auth/logout`
- **Description**: Calling `POST /api/auth/logout` clears the main session token cookie, but client-side cached state in `localStorage` (`ea_user_profile`, `ea_academic_context`) is not cleared unless the user explicitly clicks the UI Logout button. Direct API consumers or script users calling logout leave behind stale local storage context.
- **Impact**: Subsequent logins on the same browser session or device can inherit stale academic context or cached user profile identifiers.
- **Steps to Reproduce**:
  1. Log in as a student or faculty member in the browser.
  2. Inspect `localStorage` in browser dev tools; observe keys `ea_academic_context` and `ea_user_profile`.
  3. Send `POST /api/auth/logout` directly via API or fetch call.
  4. Observe `localStorage` retains the old profile data until browser storage is manually purged.

---

### Category 3: API Endpoints & Input Handling

#### Finding QA-04: Unhandled Server Crash (HTTP 500) on Malformed File Upload
- **Severity**: HIGH
- **Category**: API Error Handling / Boundary Validation
- **Affected Route**: `src/app/api/upload/route.ts`
- **Description**: The upload endpoint expects `multipart/form-data` containing a `file` field. If a client sends a JSON payload or omits the multipart body format, calling `await req.formData()` throws an unhandled exception (`TypeError` / `NextRequest` formData parsing error), resulting in an uncaught server error and returning HTTP 500 Internal Server Error instead of a structured HTTP 400 Bad Request error.
- **Impact**: Clients or third-party integrations sending improper content headers trigger unhandled runtime server exceptions and error logs.
- **Steps to Reproduce**:
  1. Authenticate as a faculty member or admin to obtain a valid session cookie.
  2. Send a POST request to `http://localhost:3000/api/upload` with header `Content-Type: application/json` and body `{ "fileName": "test.pdf" }`.
  3. Observe that the API returns HTTP 500 with unhandled error details rather than HTTP 400 Bad Request (`"Invalid upload format or missing multipart form data"`).

#### Finding QA-05: Material Download Endpoint Method Mismatch (HTTP 405)
- **Severity**: MEDIUM
- **Category**: API Routing / User Experience
- **Affected Route**: `src/app/api/materials/[id]/download/route.ts`
- **Description**: The material download route handles download counter incrementing and analytics event logging via `POST`. However, standard client links (`<a href="/api/materials/[id]/download">`) or direct user navigation issue HTTP `GET` requests. Requesting the download URL directly via `GET` returns HTTP 405 Method Not Allowed.
- **Impact**: Direct browser navigation or anchor tags pointing to the download URL fail with HTTP 405 unless triggered via explicit client-side JavaScript `fetch` POST requests.
- **Steps to Reproduce**:
  1. Open a web browser or run `curl -i http://localhost:3000/api/materials/mat-1/download`.
  2. Observe response: HTTP 405 Method Not Allowed.

#### Finding QA-06: Unfiltered API Queries Return Unrestricted Results Without Academic Context
- **Severity**: MEDIUM
- **Category**: Data Consistency / Default Scoping
- **Affected Routes**: `GET /api/subjects`, `GET /api/materials`, `GET /api/assignments`, `GET /api/papers`, `GET /api/questions`, `GET /api/atlas`
- **Description**: When a request is sent to these endpoints without an active academic context cookie or headers (`ea_academic_context`, `ea_section_id`, `x-academic-context`), the endpoints default to returning all records in the database rather than prompting for context or defaulting to a safe institutional default.
- **Impact**: API clients without initialized cookies can receive full unfiltered datasets across all departments, years, and sections.
- **Steps to Reproduce**:
  1. Run `curl -s http://localhost:3000/api/subjects` without passing any cookies or query parameters.
  2. Observe that all 12 subjects across CSE, ECE, EEE, MECH, and CIVIL branches are returned simultaneously.

#### Finding QA-07: Search Query Parameter Handling on Empty String
- **Severity**: LOW
- **Category**: API Validation
- **Affected Route**: `src/app/api/search/route.ts`
- **Description**: Sending `GET /api/search` without a `q` parameter returns empty arrays for all entities (`{ subjects: [], atlasTopics: [], ... }`), but does not return metadata indicating `queryProvided: false` or input guidance.
- **Impact**: Low impact; minor API response clarity edge case.
- **Steps to Reproduce**:
  1. Send `GET http://localhost:3000/api/search?q=`.
  2. Observe HTTP 200 with empty result arrays.

---

### Category 4: Automated Verification Suite Failures

#### Finding QA-08: E2E Verification Script Faculty Assignment Match Failure
- **Severity**: MEDIUM
- **Category**: Automated Test Failure / Data Integrity
- **Affected File**: `scripts/verify-e2e.js`
- **Description**: In `scripts/verify-e2e.js` (Test Group 2), the test resolves section `CSE-A` using `db.sections.find(s => s.name === 'CSE-A')`. Because the database contains multiple sections named `CSE-A` across different semesters (`sec-cse6-a` for Semester 6, `sec-csea` for Semester 7), `.find()` returns the Semester 6 section. Consequently, checking Dr. Kumar's teaching assignment for Semester 7 (`sec-csea`) fails with:
  `✗ FAIL: Dr. Kumar assigned to CSE-A for Operating Systems`.
- **Impact**: Running `npm run test:verify` reports 1 failing test out of 91 assertions due to ambiguous section lookup in the test script.
- **Steps to Reproduce**:
  1. Execute `npm run test:verify` or `node scripts/verify-e2e.js` in terminal.
  2. Observe failure at Test Group 2: `Dr. Kumar assigned to CSE-A for Operating Systems`.

#### Finding QA-09: Mobile Navigation Script Assertions Failure
- **Severity**: MEDIUM
- **Category**: Automated Test Failure
- **Affected File**: `scripts/verify-mobile-nav.js`
- **Description**: Running `node scripts/verify-mobile-nav.js` fails 6 out of 18 assertions. The script searches for specific CSS class names and inline styling patterns on `StudentBottomNav.tsx` (such as `max-width: 420px`, specific background hex color codes, and touch target pixel rules) that were updated during recent UI refactoring.
- **Impact**: Automated verification script yields false positive test failures against current component markup.
- **Steps to Reproduce**:
  1. Execute `node scripts/verify-mobile-nav.js`.
  2. Observe 6 failing assertions related to mobile bottom nav layout and brand styling.

#### Finding QA-10: Comprehensive Responsive Audit Failures
- **Severity**: LOW
- **Category**: Automated Audit Failure / UI Styling
- **Affected File**: `scripts/verify-responsive-audit.js`
- **Description**: Executing `node scripts/verify-responsive-audit.js` fails 5 out of 23 checks. Specifically, `src/app/faculty/classes/[classId]/page.tsx` uses fixed pixel column dimensions in one container rather than fluid `minmax(min(100%, 300px), 1fr)` grids.
- **Impact**: Faculty Class Workspace layout may exhibit horizontal scrollbars on viewports smaller than 380px.
- **Steps to Reproduce**:
  1. Execute `node scripts/verify-responsive-audit.js`.
  2. Observe failure on class workspace fluid grid minmax verification.

---

### Category 5: Responsive UI & Navigation Edge Cases

#### Finding QA-11: Faculty Class Workspace Layout Overflow on Compact Viewports (<380px)
- **Severity**: MEDIUM
- **Category**: Mobile UI / Responsiveness
- **Affected Component**: `src/app/faculty/classes/[classId]/page.tsx`
- **Description**: The class workspace layout uses fixed minimum widths (`min-w-[320px]` / `min-w-[340px]`) for sidebar cards without responsive wrapping on viewports smaller than 380px.
- **Impact**: Devices with narrow screen widths (e.g., iPhone SE at 375px or Galaxy Fold cover screens) experience minor horizontal scrolling on the Faculty Class Workspace page.
- **Steps to Reproduce**:
  1. Open Chrome DevTools and select iPhone SE device viewport (375px width).
  2. Navigate to `/faculty/classes/fa-1`.
  3. Observe slight horizontal overflow on the right margin of class workspace cards.

#### Finding QA-12: Academic Context Dropdown Stale Section Options on Branch Switch
- **Severity**: LOW
- **Category**: Frontend State / UX
- **Affected Component**: `src/components/academic/AcademicSelectorModal.tsx`
- **Description**: In the Academic Selector modal, when a user switches the selected Branch (e.g. from CSE to ECE), the Section dropdown briefly retains the previously selected section option (e.g. `CSE-A`) until the semester value is re-selected or updated.
- **Impact**: Low impact; transient UI selection artifact before final selection commit.
- **Steps to Reproduce**:
  1. Click Academic Context selector in student navbar.
  2. Select branch `ECE`.
  3. Observe section dropdown before updating semester selection.

---

## Remediation & Recommendations Summary

1. **Authorization Hardening**: Wrap `POST` and `DELETE` handlers in `src/app/api/academic/structure/route.ts` with `requireRole(req, ['ADMIN'])` to ensure only administrators can modify academic branches, subjects, and sections.
2. **Password Policy Enforcement**: Update `/api/auth/login` to return a `mustChangePassword: true` flag in the JSON payload when `user.mustChangePassword` is set, and implement a mandatory password change modal or screen before granting full portal access.
3. **Upload API Error Handling**: Wrap `req.formData()` calls in `src/app/api/upload/route.ts` with explicit `try-catch` blocks and content-type validation to return HTTP 400 Bad Request with a clear JSON error message.
4. **Material Download Route Support**: Add a `GET` handler in `src/app/api/materials/[id]/download/route.ts` that increments download counts and returns an HTTP 302 redirect or file stream.
5. **Verification Test Script Alignment**: Update `scripts/verify-e2e.js` section lookup to filter by semester ID (`sem-7`) to resolve the exact section `sec-csea`. Update `verify-mobile-nav.js` and `verify-responsive-audit.js` assertions to reflect current component implementations.

---

## Report Verification & Integrity Statement

This report was generated following comprehensive local testing of the Engineering Atlas platform. All findings listed above were confirmed using reproducible manual and automated procedures on local test data.
