---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-03-success', 'step-04-journeys', 'step-05-domain-skipped', 'step-06-innovation-skipped', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish', 'step-12-complete']
classification:
  projectType: 'Web Application'
  domain: 'HR Tech / Job Discovery'
  complexity: 'Medium'
  projectContext: 'brownfield'
inputDocuments:
  - 'product-brief-job-radar-2026-02-05.md'
  - 'epics.md'
  - 'database.ts (TypeScript types)'
  - '001_users_table.sql'
  - '003_evaluations_table.sql'
documentCounts:
  briefs: 1
  research: 0
  brainstorming: 0
  projectDocs: 4
workflowType: 'prd'
---

# Product Requirements Document - job-radar

**Author:** Lord Luca
**Date:** 2026-02-12
**Status:** Baseline Complete
**Version:** 1.0

---

## Executive Summary

**job-radar** is a personal job opportunity monitoring system that flips job hunting from pull to push. Instead of browsing job boards, users receive AI-powered notifications only when opportunities match their CV, preferences, and career aspirations.

**Target Users:** Mid-career professionals ("sleeping potentials") who are passively open to opportunities but won't invest daily time scrolling job platforms.

**Core Value Proposition:** Jobs find you. You don't hunt them.

**Tech Stack:** Next.js + Supabase + n8n (backend) + Apify (scraping)

**MVP Scope:** 4 epics (Onboarding, Job Discovery, Profile Management, Landing Page) with 43 functional requirements and 14 non-functional requirements.

---

## Success Criteria

### User Success

| Metric | Definition | Target |
|--------|------------|--------|
| **Magic Moment Delivered** | User receives a high-value job notification | At least 1 per user per week |
| **Notification Quality** | % of notifications user rates as relevant | >70% relevance rate |
| **Time to Value** | Time from signup to first useful notification | <24 hours |
| **Zero-Effort Assurance** | Users feel "watched over" without daily interaction | Qualitative |
| **Apply Rate** | % of notifications leading to applications | >10% of high-score matches |

### Business Success

| Metric | Definition | Target (3 months) |
|--------|------------|-------------------|
| **Weekly Active Users** | Users who view at least 1 notification/week | 100 WAU |
| **Organic Referrals** | New users from word-of-mouth | >50% of new signups |
| **Retention (Week 4)** | Users still active after 4 weeks | >60% |
| **Friend Activation** | Friends onboarded who become active | 10+ friends |

### Technical Success (Dogfooding)

| Metric | Definition | Target |
|--------|------------|--------|
| **Personal Job Applications** | Jobs applied to via job-radar | 10+ quality applications |
| **LinkedIn Replacement** | Days without manually browsing LinkedIn | 30+ consecutive days |
| **Learning Outcome** | Deep understanding of AI pipeline | Can explain every component |
| **Portfolio Strength** | Project quality for showcasing | Demo-ready, shareable |

### Anti-Metrics (Explicitly NOT Optimized)

| Anti-Metric | Why Avoided |
|-------------|-------------|
| Total signups | Vanity metric; quality > quantity |
| Daily active users | Product should be invisible; daily use = failure |
| Feature count | Feature creep kills side projects |
| Time in app | 30 seconds, not 30 minutes |
| Engagement loops | Respect attention; no dark patterns |

### North Star Metric

> **"High-value notifications delivered that lead to action"**
>
> A notification is successful when:
> 1. It surfaces a job the user wouldn't have found manually
> 2. The user agrees it was worth their attention
> 3. It leads to concrete action (save, apply, or research)

## Product Scope

### MVP - Minimum Viable Product

| Feature | Description |
|---------|-------------|
| **Auth** | Email/password + Google OAuth via Supabase |
| **Onboarding Flow** | CV upload, preferences, notification settings |
| **Job Feed** | View evaluated jobs sorted by score |
| **Job Actions** | Save, hide, mark as applied |
| **Apply Link** | Direct link to application URL |
| **Settings** | Edit profile, preferences, notifications |

### Growth Features (Post-MVP)

- LinkedIn OAuth for easier onboarding
- "Was this relevant?" feedback button
- AI model tuning based on user feedback
- Startup funding signal integration
- Company watchlists

### Vision (Future)

- Public waitlist / landing page
- Mobile-optimized PWA
- Analytics dashboard for users
- Community features
- B2B pivot potential

## User Journeys

### Journey 1: The Ambitious Seeker — First Match

**Persona:** Sarah, 32, Product Manager at a corporate bank
- 7 years experience, mix of startup and corporate
- Feels stuck — not challenged, watching AI reshape her industry
- Ambitious but time-poor; won't spend hours scrolling job boards

**Opening Scene:**
Sarah forces herself to browse LinkedIn on Sunday evening. After 20 minutes of sponsored posts and irrelevant matches, she closes the app frustrated.

**Rising Action:**
Her friend Luca mentions job-radar. She signs up — 5 minutes later: CV pasted, keywords set, location configured. Done.

**Climax:**
Tuesday, 6:47 AM. Email: "92% match: Head of AI Products at [exciting fintech startup]". The AI explains exactly why it matches her background. Direct apply link. Application submitted before morning coffee.

**Resolution:**
Sarah hasn't opened LinkedIn in 3 weeks. She's applied to 4 high-quality roles — all surfaced by job-radar, none found manually.

---

### Journey 2: The Comfortable Skeptic — Passive Discovery

**Persona:** Marco, 34, Corporate VC Associate
- 4 years at same company, above-market salary (golden handcuffs)
- Privately unhappy but takes no action
- Open to moving but won't hunt

**Opening Scene:**
Marco complains to Luca: "I should look for something new, but I can't be bothered." Luca sets up job-radar for him in 5 minutes.

**Rising Action:**
Marco forgets the app exists. Two weeks later, email: "87% match: Investment Director at [climate tech VC fund]".

**Climax:**
He reads the AI reasoning connecting his VC experience + MBA sustainability focus to the fund's climate mandate. He applies on impulse.

**Resolution:**
The trigger worked — Marco's now actively thinking about what he wants. Job-radar broke through his inertia without demanding effort.

---

### Journey 3: The Admin (Lord Luca) — System Operations

**Persona:** Lord Luca, Product Owner & System Admin

**Opening Scene:**
Luca wants to onboard 5 new friends and verify the pipeline is working.

**Rising Action:**
He checks Supabase dashboard — views recent jobs, spot-checks evaluation quality. Notices one user's CV wasn't parsed correctly.

**Climax:**
Identifies issue (image-based PDF), contacts user to re-upload, watches their scores improve.

**Resolution:**
System runs smoothly. 10 minutes/week on admin, mostly quality spot-checks.

---

### Journey 4: The Returner — Preference Evolution

**Persona:** Sarah (returning), 6 months later — career goals evolved

**Opening Scene:**
Now in a new role, interested in startup founding rather than PM positions.

**Rising Action:**
Logs in, navigates to Settings, updates keywords to "Co-founder", "Founding PM".

**Climax:**
Next morning's digest reflects her new direction — startup opportunities.

**Resolution:**
Job-radar adapts to her evolving career without rebuilding from scratch.

---

### Journey Requirements Summary

| Journey | Capabilities Revealed |
|---------|----------------------|
| **Ambitious Seeker** | Onboarding flow, CV upload, preference setting, email notifications, job detail view, apply link |
| **Comfortable Skeptic** | Minimal-friction signup, push notification value, AI reasoning display |
| **Admin** | Supabase dashboard access, evaluation monitoring, user management (direct DB for MVP) |
| **Returner** | Settings page, preference editing, system adaptability |

## Technical Architecture

### Technology Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Framework** | Next.js (App Router) | Modern React, great DX, Vercel deployment |
| **Auth** | Supabase Auth | Integrated with DB, email/password + Google OAuth |
| **Database** | Supabase Postgres | Shared with n8n backend, RLS for security |
| **Styling** | Tailwind CSS | Fast iteration, utility-first |
| **Deployment** | Vercel | Zero-config Next.js hosting |
| **Data Fetching** | React Query / SWR | Simple caching, optimistic updates |

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER INTERACTION                      │
│  ┌─────────────────────────────────────────────────┐    │
│  │              Next.js Frontend                    │    │
│  │  • Auth (signup/login)                          │    │
│  │  • Profile & preferences setup                  │    │
│  │  • View evaluated jobs                          │    │
│  │  • Job actions (save/hide/apply)                │    │
│  └─────────────────────────────────────────────────┘    │
│                          │                               │
│                          ▼                               │
│  ┌─────────────────────────────────────────────────┐    │
│  │           Supabase (Shared Database)            │    │
│  │  • users, evaluations, jobs tables              │    │
│  │  • Row Level Security (RLS)                     │    │
│  └─────────────────────────────────────────────────┘    │
│                          ▲                               │
│                          │                               │
│  ┌─────────────────────────────────────────────────┐    │
│  │              n8n Backend (Separate)             │    │
│  │  • Scheduled scraping via Apify                 │    │
│  │  • AI job evaluation                            │    │
│  │  • Email notifications                          │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### Scope Boundaries

| In Scope (This PRD) | Out of Scope (n8n Backend) |
|---------------------|---------------------------|
| User authentication | Job scraping |
| Onboarding flow | AI evaluation |
| Job feed display | Email notifications |
| Job actions (save/hide/apply) | Scheduling |
| Profile management | Apify integration |
| Preference editing | |

### Database Schema Summary

**users** — User profile and preferences
- `pref_roles`, `pref_locations`, `pref_industries` (arrays)
- `cv_raw`, `summary` (profile data)
- `notify_threshold`, `notify_frequency`, `notify_enabled`

**evaluations** — AI-scored job matches per user
- 5-dimension scoring: role, company, location, industry, growth
- `reason_*` fields for AI explanations
- `status`: new | viewed | saved | applied | hidden

**jobs** — Scraped job listings (populated by n8n)
- Job details, company info, URLs
- Read-only from frontend perspective

## Project Scoping & Phased Development

### MVP Strategy

**MVP Philosophy:** Problem-Solving MVP
- Solve the core problem (job discovery without effort) first
- Prove the "push, not pull" model works
- Friends-only launch for validated learning

**Resource Requirements:**
- Solo developer (Lord Luca)
- Side project timeline
- Leveraging existing tools (Supabase, n8n, Apify)

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- Ambitious Seeker: Full journey (signup → notification → apply)
- Comfortable Skeptic: Full journey (zero-effort setup → trigger)
- Returner: Full journey (preference update)

**Must-Have Capabilities:**

| Epic | Features |
|------|----------|
| **Epic 1: Onboarding** | Auth, CV upload, preferences, notification settings |
| **Epic 2: Job Discovery** | Job feed, filtering, sorting, detail view, actions |
| **Epic 3: Profile Management** | Edit preferences, CV, notification settings |
| **Epic 4: Landing Page** | Hero, how-it-works, CTA |

### Post-MVP Features

**Phase 2 (Growth):**
- LinkedIn OAuth for easier onboarding
- "Was this relevant?" feedback button
- AI model tuning based on user feedback

**Phase 3 (Expansion):**
- Startup funding signal integration
- Company watchlists
- Job alerts for specific companies

**Phase 4 (Vision):**
- Public waitlist / landing page
- Mobile-optimized PWA
- Analytics dashboard
- Community features
- B2B pivot potential

### Risk Mitigation

| Risk Type | Risk | Mitigation |
|-----------|------|------------|
| **Technical** | AI evaluation quality | Dogfooding — daily use catches issues fast |
| **Technical** | Scraping reliability | Apify handles complexity, n8n retries |
| **Market** | Low notification engagement | Threshold tuning, feedback in Phase 2 |
| **Resource** | Solo developer bandwidth | Lean MVP, no feature creep |

## Functional Requirements

### User Authentication & Onboarding

| ID | Requirement |
|----|-------------|
| FR1 | Users can create an account with email and password |
| FR2 | Users can sign up using Google OAuth |
| FR3 | Users can log in with existing credentials |
| FR4 | Users can log out and clear their session |
| FR5 | System redirects users based on onboarding status |

### Profile Setup (Onboarding)

| ID | Requirement |
|----|-------------|
| FR6 | Users can specify target job roles/keywords as tags |
| FR7 | Users can select preferred locations |
| FR8 | Users can indicate remote work preference |
| FR9 | Users can upload CV via file (PDF, DOCX, TXT) |
| FR10 | Users can paste CV text directly |
| FR11 | Users can describe career aspirations in free text |
| FR12 | Users can set daily digest time preference |
| FR13 | Users can see onboarding progress indicator |
| FR14 | Users can navigate back to previous onboarding steps |

### Job Discovery

| ID | Requirement |
|----|-------------|
| FR15 | Users can view AI-matched jobs sorted by score |
| FR16 | Users can see job title, company, location, score on cards |
| FR17 | Users can filter jobs by score range |
| FR18 | Users can filter jobs by date posted |
| FR19 | Users can filter jobs by status (New, Viewed, Saved, Applied) |
| FR20 | Users can sort jobs by score or date |
| FR21 | Users can load more jobs via pagination |

### Job Detail & Actions

| ID | Requirement |
|----|-------------|
| FR22 | Users can view full job details and AI reasoning |
| FR23 | Users can see 5-dimension AI match breakdown |
| FR24 | Users can save jobs for later review |
| FR25 | Users can hide irrelevant jobs |
| FR26 | Users can mark jobs as applied |
| FR27 | Users can click through to external application URL |
| FR28 | System updates job status to "viewed" when accessed |

### Profile Management

| ID | Requirement |
|----|-------------|
| FR29 | Users can edit their target roles/keywords |
| FR30 | Users can edit their location preferences |
| FR31 | Users can update their CV |
| FR32 | Users can edit their career aspirations |

### Notification Settings

| ID | Requirement |
|----|-------------|
| FR33 | Users can enable/disable email notifications |
| FR34 | Users can set minimum score threshold |
| FR35 | Users can change digest delivery time |
| FR36 | Users can pause notifications temporarily |

### Account Management

| ID | Requirement |
|----|-------------|
| FR37 | Users can update their email address |
| FR38 | Users can delete their account with confirmation |

### Landing Page

| ID | Requirement |
|----|-------------|
| FR39 | Visitors can understand the product value proposition |
| FR40 | Visitors can see how the product works |
| FR41 | Visitors can navigate to signup |
| FR42 | Visitors can navigate to login |
| FR43 | Authenticated users are redirected to dashboard |

## Non-Functional Requirements

### Performance

| ID | Requirement |
|----|-------------|
| NFR1 | Job feed loads within 2 seconds for up to 100 evaluated jobs |
| NFR2 | Page transitions complete within 500ms |
| NFR3 | Job actions provide immediate visual feedback |

### Security

| ID | Requirement |
|----|-------------|
| NFR4 | Users can only access their own evaluations (Supabase RLS) |
| NFR5 | CV data is stored securely and not exposed to other users |
| NFR6 | Authentication uses secure session management |
| NFR7 | All connections use HTTPS |

### Usability

| ID | Requirement |
|----|-------------|
| NFR8 | Users can complete onboarding in <5 minutes |
| NFR9 | Users can complete signup without assistance |
| NFR10 | UI is fully responsive (320px to 1440px+) |
| NFR11 | UI conveys calm, reassuring tone |

### Reliability

| ID | Requirement |
|----|-------------|
| NFR12 | No crashes during normal usage |
| NFR13 | Form data persists across onboarding steps |
| NFR14 | Graceful error handling with user-friendly messages |
