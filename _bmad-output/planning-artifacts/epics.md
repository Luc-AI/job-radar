---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - "product-brief-job-radar-2026-02-05.md"
  - "DB Schema (dbdiagram format - users, jobs, evaluations tables)"
  - "Wireframes HTML (10 pages: landing, onboarding, dashboard, profile, notifications, job detail)"
  - "Design reference screenshot (EduMate-style clean UI)"
  - "User input: Responsive design requirement + calm/reassuring UX tone"
---

# job-radar - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for job-radar, decomposing the requirements from the Product Brief, DB Schema, Wireframes, and design direction into implementable stories.

## Requirements Inventory

### Functional Requirements

| ID | Requirement | Source |
|----|-------------|--------|
| **FR1** | **User Authentication**: Email/password signup and login via Supabase Auth | Brief: Core Features |
| **FR2** | **Landing Page**: Marketing page with value proposition, how-it-works, and CTA | Wireframe: Page 1 |
| **FR3** | **Onboarding Step 1**: Capture job preferences (target roles/keywords, location, remote preference) | Wireframe: Page 2 |
| **FR4** | **Onboarding Step 2**: Upload CV via file upload OR paste text | Wireframe: Page 3 |
| **FR5** | **Onboarding Step 3**: Capture career aspirations (free text), email, digest time preference | Wireframe: Page 4 |
| **FR6** | **Onboarding Success**: Confirmation screen showing what happens next | Wireframe: Page 5 |
| **FR7** | **Job Dashboard**: View evaluated jobs sorted by score with AI match reasoning visible | Brief + Wireframe: Page 7 |
| **FR8** | **Job Filtering**: Filter jobs by score range, date posted, status (new/viewed/applied) | Wireframe: Page 7 |
| **FR9** | **Job Detail View**: Full job description + AI match breakdown + company info + actions | Wireframe: Page 10 |
| **FR10** | **Job Actions**: Save job, hide job, mark as applied | Brief: Core Features |
| **FR11** | **Apply Link**: Direct link to external job application URL | Brief: Core Features |
| **FR12** | **Profile Management**: Edit CV, keywords, location, career preferences | Wireframe: Page 8 |
| **FR13** | **Notification Settings**: Set score threshold, digest time, pause/resume notifications | Wireframe: Page 9 |
| **FR14** | **User Settings**: Change email, delete account | Wireframe: Page 8-9 |

### Non-Functional Requirements

| ID | Requirement | Source |
|----|-------------|--------|
| **NFR1** | **Self-Service Onboarding**: Users must complete signup and configuration without assistance | Brief: MVP Success |
| **NFR2** | **Time to Value**: <5 minutes from signup to "ready to receive notifications" | Brief: MVP Success |
| **NFR3** | **Stability**: No crashes or auth issues during normal usage | Brief: MVP Success |
| **NFR4** | **Responsive Design**: Mobile-friendly + desktop, fully responsive layout | User Input |
| **NFR5** | **Calm UX Tone**: UI conveys assurance and calmness — "we're looking out for you" | User Input |
| **NFR6** | **Performance**: Job feed loads quickly even with 100+ evaluated jobs | Implied |
| **NFR7** | **Security**: Row-level security on user data; users only see their own evaluations | Brief: Tech Stack |

### Additional Requirements

#### Technical Requirements (from DB Schema)

| Requirement | Detail |
|-------------|--------|
| **Supabase Auth Integration** | `users.id` links to `auth.users` — use Supabase Auth for identity |
| **CV Storage** | Store raw CV text in `cv_raw` field; support file upload → text extraction |
| **Preference Arrays** | `pref_roles`, `pref_industries`, `pref_locations` are varchar arrays — UI must support multi-select |
| **Notification Config** | `notify_threshold` (decimal 1-10), `notify_frequency` (realtime/daily/weekly), `notify_enabled` (boolean) |
| **Evaluation Scores** | 5-dimension scoring (role, company, location, industry, growth) with text reasoning per dimension |
| **Status Tracking** | Evaluation status: new → saved → applied → hidden |
| **Excluded Companies** | `pref_excluded_companies` array — blocklist feature |

#### UX Requirements (from Wireframes)

| Requirement | Detail |
|-------------|--------|
| **Progress Indicator** | 3-step onboarding with visual progress bar |
| **Score Badges** | Visual score display (color-coded: green 90%+, blue 80%+, etc.) |
| **Status Chips** | NEW / VIEWED / APPLIED status badges on job cards |
| **Expandable Cards** | Job cards with "Show more" to expand details |
| **Sidebar Navigation** | Main nav: Jobs, Profile, Notifications |
| **Back Navigation** | "Back to Jobs" from detail view |
| **Sort Controls** | Sort by score (high to low), date, etc. |
| **Load More Pagination** | "Load More" button pattern vs. infinite scroll |

#### Design Requirements (from Screenshot + User Input)

| Requirement | Detail |
|-------------|--------|
| **Card-Based Layout** | Content in clean cards with subtle shadows |
| **Inline Actions** | Action buttons inline with content |
| **Company Logo Display** | Company logos in job cards where available |
| **Clean Typography** | Clear hierarchy with bold headings |
| **Light Color Palette** | Professional, calming aesthetic with accent colors |
| **Filter Bar** | Top-level filters + sort controls |
| **Reassuring Tone** | UI language and design conveys "we've got your back" |

### FR Coverage Map

| FR | Epic | Description |
|----|------|-------------|
| FR1 | Epic 1 | User Authentication |
| FR2 | Epic 4 | Landing Page |
| FR3 | Epic 1 | Onboarding Step 1 (preferences) |
| FR4 | Epic 1 | Onboarding Step 2 (CV) |
| FR5 | Epic 1 | Onboarding Step 3 (final details) |
| FR6 | Epic 1 | Onboarding Success |
| FR7 | Epic 2 | Job Dashboard |
| FR8 | Epic 2 | Job Filtering |
| FR9 | Epic 2 | Job Detail View |
| FR10 | Epic 2 | Job Actions |
| FR11 | Epic 2 | Apply Link |
| FR12 | Epic 3 | Profile Management |
| FR13 | Epic 3 | Notification Settings |
| FR14 | Epic 3 | User Settings |

## Epic List

### Epic 1: User Onboarding & Authentication
A new user can sign up (email/password + social login), configure their job search preferences, upload their CV, and be "ready to receive job matches."

**FRs covered:** FR1, FR3, FR4, FR5, FR6

**User Value:** Complete "new visitor → configured user" journey. After this epic, a user is fully onboarded and the n8n backend can start evaluating jobs for them.

---

### Epic 2: Job Discovery & Actions
A logged-in user can browse their AI-matched jobs, filter them by various criteria, view detailed match reasoning, and take actions (save, hide, apply).

**FRs covered:** FR7, FR8, FR9, FR10, FR11

**User Value:** The core value loop — the reason users come back. Full "browse and act on jobs" experience.

---

### Epic 3: Profile & Notification Management
A user can update their search criteria, CV, notification preferences, and account settings over time.

**FRs covered:** FR12, FR13, FR14

**User Value:** Refinement features that make the system "liveable" long-term. Users can evolve their job search as their goals change.

---

### Epic 4: Marketing Landing Page
A visitor can understand Job Radar's value proposition and start the signup process. Required for social login OAuth redirect flows.

**FRs covered:** FR2

**User Value:** Entry point for new users. Communicates product value and enables social login authentication flow.

---

## Epic 1: User Onboarding & Authentication

### Story 1.1: Project Setup & Auth Foundation

**As a** new visitor,
**I want** to create an account with email and password,
**So that** I can access Job Radar and start setting up my job search.

**Acceptance Criteria:**

**Given** I am on the signup page
**When** I enter a valid email and password (min 8 chars)
**Then** my account is created in Supabase Auth
**And** a corresponding row is created in the `users` table with my email
**And** I am redirected to onboarding step 1

**Given** I am on the signup page
**When** I enter an email that already exists
**Then** I see an error message "An account with this email already exists"
**And** I am offered a link to login instead

**Given** I am a returning user on the login page
**When** I enter valid credentials
**Then** I am authenticated and redirected to the job dashboard (or onboarding if incomplete)

**Given** I am logged in
**When** I click logout
**Then** my session is cleared and I am redirected to the login page

**Given** I am on any page
**Then** I see a responsive app shell with logo header and navigation
**And** the layout works on mobile (320px) through desktop (1440px+)

---

### Story 1.2: Social Login with Google

**As a** new visitor,
**I want** to sign up using my Google account,
**So that** I can get started faster without creating a new password.

**Acceptance Criteria:**

**Given** I am on the signup or login page
**When** I click "Continue with Google"
**Then** I am redirected to Google OAuth consent screen
**And** upon approval, my account is created/linked in Supabase Auth
**And** a corresponding `users` row is created if new
**And** I am redirected to onboarding (new) or dashboard (returning)

**Given** I previously signed up with email
**When** I try to login with Google using the same email
**Then** the accounts are linked (or appropriate error shown based on Supabase config)

---

### Story 1.3: Onboarding Step 1 - Job Preferences

**As a** newly registered user,
**I want** to specify what jobs I'm looking for,
**So that** the AI can find relevant matches for me.

**Acceptance Criteria:**

**Given** I am authenticated and on onboarding step 1
**Then** I see a progress indicator showing step 1 of 3

**Given** I am on step 1
**When** I add target job titles/keywords (e.g., "Product Manager", "AI Product")
**Then** each keyword is added as a tag/chip that I can remove
**And** the values are stored in `users.pref_roles` array

**Given** I am on step 1
**When** I select a location (city/country dropdown or search)
**Then** the value is stored in `users.pref_locations` array

**Given** I am on step 1
**When** I toggle "Remote OK" checkbox
**Then** the value is stored in `users.pref_remote` field

**Given** I have entered at least one keyword and one location
**When** I click "Next"
**Then** my preferences are saved to the database
**And** I am navigated to onboarding step 2

**Given** I have not entered required fields
**When** I click "Next"
**Then** I see validation errors indicating required fields

---

### Story 1.4: Onboarding Step 2 - CV Upload

**As a** user in onboarding,
**I want** to provide my CV/resume,
**So that** the AI can match jobs against my actual background.

**Acceptance Criteria:**

**Given** I am on onboarding step 2
**Then** I see a progress indicator showing step 2 of 3
**And** I see a file upload dropzone AND a text paste area

**Given** I am on step 2
**When** I drag and drop a PDF, DOCX, or TXT file
**Then** the file is parsed and text content is extracted
**And** the extracted text is stored in `users.cv_raw`
**And** I see a preview/confirmation of the upload

**Given** I am on step 2
**When** I paste text into the CV text area
**Then** the text is stored in `users.cv_raw`

**Given** I have provided CV content (file OR paste)
**When** I click "Next"
**Then** my CV is saved and I am navigated to step 3

**Given** I click "Back"
**Then** I return to step 1 with my previous entries preserved

---

### Story 1.5: Onboarding Step 3 - Final Details

**As a** user completing onboarding,
**I want** to describe what I'm looking for and set my notification preferences,
**So that** Job Radar understands my goals and knows when to notify me.

**Acceptance Criteria:**

**Given** I am on onboarding step 3
**Then** I see a progress indicator showing step 3 of 3

**Given** I am on step 3
**When** I enter free text describing what I want in my next role
**Then** the text is stored in `users.summary`

**Given** I am on step 3
**When** I select a daily digest time from the dropdown
**Then** the time preference is stored in the user's notification settings

**Given** I have completed the required fields
**When** I click "Start Matching"
**Then** my profile is marked as onboarding complete
**And** `users.is_active` is set to true
**And** I am navigated to the success screen

---

### Story 1.6: Onboarding Success Screen

**As a** user who just completed onboarding,
**I want** to see confirmation that everything is set up,
**So that** I feel assured the system is working for me.

**Acceptance Criteria:**

**Given** I have completed onboarding
**Then** I see a success screen with a checkmark/celebration visual
**And** I see a message explaining what happens next
**And** the tone is calm and reassuring ("We're on it. Your first matches arrive tomorrow at [time].")

**Given** I am on the success screen
**When** I click "View Dashboard" or similar CTA
**Then** I am navigated to the job dashboard

**Given** I am on the success screen
**When** I click "Adjust Settings"
**Then** I am navigated to the profile/settings page

---

## Epic 2: Job Discovery & Actions

### Story 2.1: Job Dashboard - Basic List View

**As a** logged-in user,
**I want** to see my AI-matched jobs in a list,
**So that** I can quickly scan opportunities that match my profile.

**Acceptance Criteria:**

**Given** I am logged in and on the job dashboard
**Then** I see a list of jobs from `evaluations` joined with `jobs` for my user
**And** jobs are sorted by `score_total` descending by default
**And** each job card shows: title, company, location, score badge, posted date
**And** each card shows a brief "Why it matches" summary

**Given** I am on the dashboard
**Then** I see the total count of matched jobs (e.g., "23 jobs matched")
**And** I see count of new jobs (e.g., "3 new today")

**Given** I am on mobile
**Then** the job list displays in a single-column responsive layout
**And** cards are touch-friendly with adequate tap targets

**Given** there are more than 20 jobs
**Then** I see a "Load More" button to fetch additional results
**And** clicking it appends more jobs without page reload

---

### Story 2.2: Job Filtering

**As a** user browsing jobs,
**I want** to filter the job list by score, date, and status,
**So that** I can focus on the most relevant opportunities.

**Acceptance Criteria:**

**Given** I am on the job dashboard
**Then** I see a filter sidebar (desktop) or filter button (mobile)

**Given** I am viewing filters
**When** I select score ranges (90%+, 80-89%, 70-79%)
**Then** the job list updates to show only jobs matching selected scores

**Given** I am viewing filters
**When** I select date posted (Today, Last 7 days, Last 30 days)
**Then** the job list updates to show only jobs within that timeframe

**Given** I am viewing filters
**When** I select status (New, Viewed, Saved, Applied)
**Then** the job list updates to show only jobs with that status

**Given** I have applied filters
**Then** the job count updates to reflect filtered results
**And** I can clear filters to return to the full list

**Given** I am on mobile
**When** I tap the filter button
**Then** a filter drawer/modal opens
**And** I can apply filters and close to see results

---

### Story 2.3: Job Sorting

**As a** user browsing jobs,
**I want** to sort jobs by different criteria,
**So that** I can prioritize what matters most to me.

**Acceptance Criteria:**

**Given** I am on the job dashboard
**Then** I see a sort dropdown with options

**Given** I select "Score (high to low)"
**Then** jobs are ordered by `score_total` descending

**Given** I select "Date (newest first)"
**Then** jobs are ordered by `posted_at` descending

**Given** I select "Date (oldest first)"
**Then** jobs are ordered by `posted_at` ascending

**Given** I change the sort option
**Then** the list updates immediately without page reload

---

### Story 2.4: Job Detail View

**As a** user interested in a specific job,
**I want** to see the full job details and AI match breakdown,
**So that** I can decide whether to apply.

**Acceptance Criteria:**

**Given** I am on the job dashboard
**When** I click on a job card (or "View Details" button)
**Then** I navigate to the job detail page

**Given** I am on the job detail page
**Then** I see the full job information:
- Job title, company name, location
- Score badge prominently displayed
- Full job description (from `jobs.description`)
- Employment type, seniority level
- Salary range (if available from `ai_salary_*` fields)
- Remote/hybrid options

**Given** I am on the job detail page
**Then** I see the AI match breakdown:
- Overall score with explanation
- Individual dimension scores (role, company, location, industry, growth)
- Reasoning text for each dimension (from `evaluations.reason_*`)

**Given** I am on the job detail page
**Then** I see company information sidebar:
- Company name, industry, size
- Company website link (if available)

**Given** I am on the job detail page
**Then** I see a "Back to Jobs" link
**When** I click it
**Then** I return to the dashboard with my filters preserved

**Given** I am on the job detail page on mobile
**Then** the layout is single-column and readable
**And** the AI breakdown is collapsible to save space

---

### Story 2.5: Job Actions - Save, Hide, Applied

**As a** user viewing jobs,
**I want** to save jobs, hide irrelevant ones, or mark jobs as applied,
**So that** I can track my job search progress.

**Acceptance Criteria:**

**Given** I am on a job card or job detail page
**Then** I see action buttons: Save, Hide, Mark Applied

**Given** I click "Save" on a job
**Then** the job's `evaluations.status` is updated to "saved"
**And** I see visual confirmation (button state change, toast message)
**And** the job appears when I filter by "Saved" status

**Given** I click "Hide" on a job
**Then** the job's `evaluations.status` is updated to "hidden"
**And** the job is removed from the default view
**And** I can still see it if I explicitly filter by "Hidden"

**Given** I click "Mark Applied" on a job
**Then** the job's `evaluations.status` is updated to "applied"
**And** I see visual confirmation
**And** the job appears when I filter by "Applied" status

**Given** I view a job I haven't interacted with
**Then** the job's status is "new"
**When** I view the job detail
**Then** the status updates to "viewed" (implicit status change)

---

### Story 2.6: Apply Link - External Application

**As a** user ready to apply for a job,
**I want** to quickly access the application page,
**So that** I can apply with minimal friction.

**Acceptance Criteria:**

**Given** I am on the job detail page
**Then** I see a prominent "Apply on Company Site" button

**Given** I click the apply button
**Then** a new tab opens with `jobs.apply_url` (or `jobs.url` as fallback)
**And** the job status is automatically updated to "applied"

**Given** the job has `apply_url`
**Then** the button links to `apply_url`

**Given** the job only has `url` (no separate apply URL)
**Then** the button links to `url`

**Given** I am on the job card in the dashboard
**Then** I can also access the apply link directly (optional quick action)

---

## Epic 3: Profile & Notification Management

### Story 3.1: Profile Page - Edit Job Preferences

**As a** user whose job search has evolved,
**I want** to update my target roles, location, and preferences,
**So that** future job matches reflect my current goals.

**Acceptance Criteria:**

**Given** I am logged in and navigate to Profile/Preferences
**Then** I see my current job preferences pre-filled:
- Target roles/keywords (from `users.pref_roles`)
- Locations (from `users.pref_locations`)
- Remote preference (from `users.pref_remote`)

**Given** I am on the profile page
**When** I add or remove keywords/roles
**Then** the changes are reflected in the UI immediately

**Given** I am on the profile page
**When** I change my location preferences
**Then** I can add multiple locations or remove existing ones

**Given** I have made changes
**When** I click "Save Changes"
**Then** my preferences are updated in the database
**And** I see a success confirmation

**Given** I navigate away without saving
**Then** I am warned about unsaved changes (optional UX enhancement)

---

### Story 3.2: Profile Page - Edit CV

**As a** user with an updated resume,
**I want** to replace or edit my CV,
**So that** job matching uses my latest experience.

**Acceptance Criteria:**

**Given** I am on the profile page
**Then** I see my current CV status (e.g., "CV uploaded 2 weeks ago" or text preview)

**Given** I want to update my CV
**When** I click "Replace" or upload a new file
**Then** the new file is parsed and `users.cv_raw` is updated

**Given** I want to edit CV text directly
**When** I modify the text in the CV text area
**And** click "Save Changes"
**Then** `users.cv_raw` is updated with the new text

**Given** I am on the profile page
**Then** I can view my current CV text (expandable or in a modal)

---

### Story 3.3: Profile Page - Career Aspirations

**As a** user refining what I want,
**I want** to update my career aspirations text,
**So that** the AI better understands my goals.

**Acceptance Criteria:**

**Given** I am on the profile page
**Then** I see my current aspirations text (from `users.summary`)

**Given** I edit the aspirations text
**When** I click "Save Changes"
**Then** `users.summary` is updated

---

### Story 3.4: Notification Settings Page

**As a** user controlling my notifications,
**I want** to configure when and how I receive job alerts,
**So that** I get notified on my terms.

**Acceptance Criteria:**

**Given** I am logged in and navigate to Notification Settings
**Then** I see my current notification configuration:
- Email address
- Daily digest enabled/disabled
- Digest send time
- Minimum score threshold

**Given** I am on notification settings
**When** I toggle "Send daily digest emails"
**Then** `users.notify_enabled` is updated

**Given** I am on notification settings
**When** I change the digest time dropdown
**Then** the new time preference is saved

**Given** I am on notification settings
**When** I adjust the "Minimum score to include" dropdown (e.g., 70%, 80%, 90%)
**Then** `users.notify_threshold` is updated
**And** I see helper text explaining what this means

**Given** I am on notification settings
**When** I check "Pause all emails"
**Then** notifications are paused but job scanning continues
**And** I can resume at any time

**Given** I click "Save Settings"
**Then** all notification preferences are persisted
**And** I see a success confirmation

---

### Story 3.5: User Account Settings

**As a** user managing my account,
**I want** to update my email or delete my account,
**So that** I have control over my data.

**Acceptance Criteria:**

**Given** I am on settings
**Then** I see my current email address

**Given** I want to change my email
**When** I enter a new email and confirm
**Then** Supabase Auth email is updated (may require verification)
**And** `users.email` is synced

**Given** I want to delete my account
**When** I click "Delete Account"
**Then** I see a confirmation modal warning this is permanent
**And** I must type "DELETE" or similar to confirm

**Given** I confirm account deletion
**Then** my user record is deleted (or anonymized per policy)
**And** I am logged out and redirected to landing page

---

## Epic 4: Marketing Landing Page

### Story 4.1: Landing Page - Hero & Value Proposition

**As a** first-time visitor,
**I want** to immediately understand what Job Radar does,
**So that** I can decide if it's worth signing up.

**Acceptance Criteria:**

**Given** I visit the landing page (unauthenticated)
**Then** I see a hero section with:
- Clear headline communicating the core value ("Stop Wasting Time on Job Boards")
- Supporting subheadline explaining the benefit
- Primary CTA button ("Get Started Free" or similar)

**Given** I am on the landing page
**Then** the design conveys calm and assurance
**And** the tone says "we've got your back"

**Given** I am on mobile
**Then** the hero section is responsive and readable
**And** the CTA button is prominently visible

**Given** I click the primary CTA
**Then** I am navigated to the signup page

---

### Story 4.2: Landing Page - How It Works

**As a** visitor considering signup,
**I want** to understand how Job Radar works,
**So that** I know what to expect.

**Acceptance Criteria:**

**Given** I am on the landing page
**Then** I see a "How It Works" section with 3 steps:
1. Tell us what you want (keywords, location, CV)
2. AI finds & scores jobs (daily scraping + smart matching)
3. Get top matches via email (only high-score jobs, no noise)

**Given** I am viewing the steps
**Then** each step has an icon/visual and brief description
**And** the flow is visually clear (numbered or connected)

**Given** I am on mobile
**Then** the steps stack vertically and remain readable

---

### Story 4.3: Landing Page - Secondary CTA & Footer

**As a** visitor ready to sign up,
**I want** clear paths to get started,
**So that** I can easily begin.

**Acceptance Criteria:**

**Given** I am on the landing page
**Then** I see a secondary CTA section below "How It Works"
**And** it reinforces the value prop and has a signup button

**Given** I am on the landing page
**Then** I see a footer with:
- Basic links (About, Privacy, Contact)
- Copyright notice

**Given** I am logged in and visit the landing page
**Then** I am redirected to the job dashboard (or see a "Go to Dashboard" button)

---

### Story 4.4: Landing Page - Header & Navigation

**As a** visitor on the landing page,
**I want** to see clear navigation options,
**So that** I can log in if I already have an account.

**Acceptance Criteria:**

**Given** I am on the landing page (unauthenticated)
**Then** I see a header with:
- Job Radar logo (links to landing page)
- Login button/link

**Given** I click "Login"
**Then** I am navigated to the login page

**Given** I am on mobile
**Then** the header is compact and functional
**And** login is accessible (not hidden in a menu for this simple nav)
