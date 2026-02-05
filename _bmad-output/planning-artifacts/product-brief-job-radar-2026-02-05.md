---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments:
  - "User-provided: Database schema (dbdiagram format)"
  - "User-provided: Apify API references (career-site-job-listing-api, advanced-linkedin-job-search-api)"
  - "Conversation context: Tech stack preferences (Next.js, Supabase, n8n, Apify)"
date: 2026-02-05
author: Lord Luca
project_name: job-radar
---

# Product Brief: job-radar

## Executive Summary

**job-radar** is a personal job opportunity monitoring system that flips the traditional job hunting model from pull to push. Instead of browsing job boards daily, users receive intelligent notifications only when opportunities match their CV, preferences, and career aspirations.

The product targets "sleeping potentials" — professionals who are passively open to new opportunities but unwilling to invest daily time scrolling through noise-filled job platforms. By combining automated job scraping, AI-powered evaluation against personal profiles, and threshold-based notifications, job-radar delivers high-value signals while respecting users' time and attention.

Built as a side project with zero monetization pressure, the product prioritizes genuine user value over engagement metrics — the opposite of what job platforms optimize for.

---

## Core Vision

### Problem Statement

Job hunting today requires active, repetitive effort that most professionals can't sustain. Platforms like LinkedIn optimize for engagement time, not user efficiency — showing volume over relevance, burying good matches behind sponsored posts, and sending spammy notifications designed to pull users back rather than inform them.

The result: people either waste hours scrolling through irrelevant listings, or they disengage entirely and miss opportunities that could change their careers.

### Problem Impact

- **Time drain**: Daily browsing across multiple platforms to catch new postings
- **Signal buried in noise**: Relevant jobs hidden among reposted, old, or poorly-matched listings
- **Filter failures**: Platform filters can't account for personal CV fit or nuanced preferences
- **Notification spam**: Alerts designed to drive engagement, not deliver value
- **Passive talent trapped**: Millions of "sleeping potentials" stuck in unsatisfying roles because the switching cost (time investment) exceeds their pain threshold

### Why Existing Solutions Fall Short

| Solution | Limitation |
|----------|------------|
| LinkedIn Jobs | Optimizes for sponsored post views; keeps users scrolling |
| Job board alerts | Spammy, unpersonalized, designed to pull users to platform |
| Job aggregators | Volume without intelligence; no CV-matching |
| Recruiter outreach | Hit-or-miss; often irrelevant; requires being "visible" |

**The gap**: No solution combines automated discovery + personal CV assessment + respectful push notifications.

### Proposed Solution

**job-radar** automates the entire job discovery workflow:

1. **Scrape** — Pull new job postings from LinkedIn, Jobs.ch, and company career sites via Apify
2. **Assess** — AI evaluates each job against user's CV, skills, preferences, and career goals
3. **Score** — Multi-dimensional scoring (role fit, company fit, location, industry, growth potential)
4. **Notify** — Push notifications only when opportunities exceed user's personal threshold

The user does nothing until something worth their attention appears.

### Key Differentiators

1. **Push, not pull** — Jobs find you; you don't hunt them
2. **AI-personalized assessment** — Scores based on YOUR CV and preferences, not generic filters
3. **Threshold-based notifications** — Only high-signal alerts; no spam
4. **Built by the user, for the user** — Solo developer who IS the target audience
5. **No monetization pressure** — Optimizes for user value, not engagement or revenue
6. **Respects time** — Designed for "sleeping potentials" who won't actively job hunt

---

## Target Users

### Primary Users

#### Persona: "The Ambitious Seeker"

**Profile:**
- Mid-career professional (5-10 years experience), typically 28-38 years old
- Roles: Product Manager, Business Development, Corporate Innovation, Venture Capital, Tech generalist
- Background: Mix of corporate and startup experience, or corporate-only feeling the itch
- Location: Urban centers, knowledge economy hubs (e.g., Zurich, Berlin, London)

**Context & Motivation:**
- Feels stuck in current role — not challenged, lacking purpose, or watching AI reshape their industry
- Ambitious but time-poor; won't spend hours scrolling job boards
- Wants to "get back to a cool job" or find work with meaning
- Believes the right opportunity exists — just can't find it efficiently

**Current Behavior:**
- Forces themselves to browse LinkedIn sporadically (guilt-driven, not habit)
- Occasionally checks niche platforms but inconsistently
- Has considered building their own scraper or tracking system
- Talks about changing jobs more than actually searching

**Pain Points:**
- Job boards optimize for engagement, not efficiency
- Filters can't capture nuanced preferences (culture, mission, growth potential)
- No signal when interesting companies start hiring (e.g., post-funding)
- The search itself feels like a second job

**Success Vision:**
> "6am notification in my inbox. One job. Highly relevant. Link to apply directly. Done in 30 seconds. No headache."

---

### Secondary Users

#### Persona: "The Comfortable Skeptic" (Sleeping Potential)

**Profile:**
- Mid-level professional, early 30s
- Roles: Corporate VC, Innovation Manager, Business Development, Tech PM
- Tenure: 3-5 years at current company
- Compensation: Above-market salary (golden handcuffs)

**Context & Motivation:**
- Privately unhappy or unfulfilled but publicly "fine"
- Asks themselves "what am I doing?" but doesn't act
- Values purpose, vision, and challenge over salary
- Open-minded but risk-averse; needs external trigger to move

**Current Behavior:**
- Hasn't updated LinkedIn in 1-2 years
- Complains about work to friends but takes no action
- Would consider a move for the *right* opportunity — but won't hunt for it
- Classic "this is fine" meme energy

**Pain Points:**
- Lacks impulse/trigger to overcome inertia
- Doesn't know what's out there (hasn't looked in years)
- Fears the effort of job hunting more than the discomfort of staying
- Golden cage: good salary makes leaving feel irrational

**Unlock Criteria:**
- **Purpose-driven role** at a company with clear mission
- **New challenge** that reignites intellectual curiosity
- **Respected company** they'd be proud to join
- Salary match is sufficient — premium not required

---

### User Journey

#### Discovery
- **Ambitious Seeker**: Builds it themselves OR hears about it from the builder (Lord Luca)
- **Comfortable Skeptic**: Friend (Lord Luca) sets it up for them; zero effort required

#### Onboarding
1. Upload CV or connect LinkedIn (one-time)
2. Set preferences: target roles, industries, locations, excluded companies
3. Set notification threshold (e.g., "only notify me for 7+ scores")
4. Done. No daily interaction required.

#### Core Usage
- **Zero daily effort** — system runs in background
- Notifications arrive only when threshold exceeded
- Each notification = one job + score breakdown + direct apply link

#### Success Moment ("Aha!")
- Receives notification for a role they would never have found manually
- Realizes: "This is exactly what I wanted — and I didn't have to look for it"

#### Long-term
- Becomes passive background service; user forgets it's running
- Occasionally adjusts preferences as career goals evolve
- Refers friends (other sleeping potentials)

---

## Success Metrics

### User Success Metrics

| Metric | Definition | Target |
|--------|------------|--------|
| **Magic Moment Delivered** | User receives a high-value job notification in their inbox | At least 1 per user per week |
| **Notification Quality** | % of notifications user rates as "relevant" or acts on | >70% relevance rate |
| **Time to Value** | Time from signup to first useful notification | <24 hours |
| **Zero-Effort Assurance** | Users feel "watched over" without daily interaction | Qualitative (user feedback) |
| **Apply Rate** | % of notifications that lead to job applications | >10% of high-score matches |

### Creator Success Metrics (Dogfooding)

| Metric | Definition | Target (3 months) |
|--------|------------|-------------------|
| **Personal Job Applications** | Jobs applied to via job-radar | 10+ quality applications |
| **LinkedIn Replacement** | Days without manually browsing LinkedIn | 30+ consecutive days |
| **Learning Outcome** | Deep understanding of AI pipeline (not black-box) | Can explain every component |
| **Portfolio Strength** | Project quality for showcasing | Demo-ready, shareable |

### Growth Metrics

| Metric | Definition | Target (3 months) |
|--------|------------|-------------------|
| **Weekly Active Users (WAU)** | Users who receive and view at least 1 notification/week | 100 WAU |
| **Organic Referrals** | New users from word-of-mouth | >50% of new signups |
| **Retention (Week 4)** | Users still active 4 weeks after signup | >60% |
| **Friend Activation** | Friends onboarded who become active | 10+ friends actively using |

### Anti-Metrics (What We Explicitly Don't Optimize For)

| Anti-Metric | Why We Avoid It |
|-------------|-----------------|
| Total signups | Vanity metric; quality > quantity |
| Daily active users | Product should be invisible; daily use = failure |
| Feature count | Feature creep kills side projects |
| Time in app | Users should spend 30 seconds, not 30 minutes |
| Engagement loops | Respect attention; no dark patterns |

### North Star Metric

> **"High-value notifications delivered that lead to action"**
>
> A notification is successful when:
> 1. It surfaces a job the user wouldn't have found manually
> 2. The user agrees it was worth their attention (relevance)
> 3. It leads to concrete action (save, apply, or research)

This single metric captures both user value (quality match) and product effectiveness (prompts action).

---

## MVP Scope

### Project Boundary

This MVP covers the **Next.js frontend application** only. The backend pipeline (scraping, AI evaluation, email notifications) is handled separately by n8n workflows writing to the shared Supabase database.

### Architecture Overview

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
│  │  • users, user_preferences, user_documents      │    │
│  │  • jobs, evaluations                            │    │
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

### Core Features (Must Have)

| Feature | Description | Why Essential |
|---------|-------------|---------------|
| **Auth** | Email/password signup & login via Supabase Auth | Self-service onboarding for friends |
| **Onboarding Flow** | Upload CV (paste text), set preferences (roles, industries, locations, excluded companies) | Enables AI evaluation to work |
| **Notification Settings** | Set score threshold, enable/disable notifications | Controls signal quality |
| **Job Feed** | View evaluated jobs sorted by score, with AI reasoning visible | The core value delivery |
| **Job Actions** | Save, hide, mark as applied | Track user journey |
| **Apply Link** | Direct link to job application URL | The 30-second goal |
| **Settings** | Edit profile, preferences, notification threshold | Users evolve over time |

### Out of Scope (V2+)

| Feature | Why Deferred |
|---------|--------------|
| LinkedIn OAuth | Adds complexity; paste CV text is sufficient for MVP |
| Job search/filtering | n8n already filters; users just see top matches |
| Analytics dashboard | Nice-to-have; not core value |
| Feedback loops ("was this relevant?") | Learning feature for later |
| Multiple notification channels | Email via n8n is enough |
| Admin panel | Lord Luca can manage via Supabase dashboard |
| Mobile app | Web-first; responsive design sufficient |
| Public landing page | Friends-only for now; direct invite |

### MVP Success Criteria

| Criteria | Target |
|----------|--------|
| **Self-service signup** | 10 friends can sign up and configure profiles without help |
| **End-to-end flow works** | User signs up → sets preferences → receives email notification → clicks through to job |
| **Time to value** | <5 minutes from signup to "ready to receive notifications" |
| **Core loop functional** | Jobs appear in feed with scores; user can act on them |
| **Stability** | No crashes or auth issues during friend testing |

### Tech Stack (Frontend)

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Framework | Next.js (App Router) | Modern React, great DX, Vercel deployment |
| Auth | Supabase Auth | Integrated with DB, email/password out of box |
| Database | Supabase Postgres | Shared with n8n, RLS for security |
| Styling | Tailwind CSS | Fast iteration, utility-first |
| Deployment | Vercel | Zero-config Next.js hosting |
| State | React Query / SWR | Simple data fetching, caching |

### Future Vision (Post-MVP)

**Phase 2: Feedback & Learning**
- "Was this job relevant?" feedback button
- AI model tuning based on user feedback
- Improved scoring over time

**Phase 3: Enhanced Discovery**
- Startup funding signal integration (track companies post-raise)
- Company watchlists
- Job alerts for specific companies

**Phase 4: Scale & Polish**
- Public waitlist / landing page
- Mobile-optimized PWA
- Analytics dashboard for users
- LinkedIn OAuth for easier onboarding

**Long-term Vision**
- Community features (anonymous salary sharing?)
- B2B pivot: help startups find "sleeping potential" candidates
- API for other job discovery tools
