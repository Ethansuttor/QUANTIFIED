# Antigravity Agent Configuration - Life Dashboard

This file defines the behavior, design systems, and specialized capabilities for the Antigravity agent in the Life Dashboard project.

## 🚀 Core Behavioral Rules (Always Enforced)

- **Do what has been asked**; nothing more, nothing less.
- **Maintain Context Synergy**: Always cross-reference `CLAUDE.md` for project architectural rules.
- **NEVER create files** unless absolutely necessary.
- **ALWAYS prefer editing** existing files to creating new ones.
- **NEVER save to root** — use the directories defined below.
- **AESTHETICS ARE MANDATORY**: If a web app looks simple or basic, you have failed.
- **Don't use placeholders**: If you need an image, use `generate_image`.
- **Unique IDs**: Ensure all interactive elements have unique, descriptive IDs for browser testing.

## 🏗️ Project Architecture & Layout

- **Source Code**: `/src` or `/app` (Next.js App Router).
- **Components**: `/components/ui`, `/components/dashboard`, `/components/charts`.
- **Database**: `/lib/supabase` (Supabase Client).
- **Environment**: Use `.env.local` for credentials. NEVER commit secrets.

## 🎨 Web Application Design System

Implement designs that feeling **PREMIUM** and **ELITE**:

- **Palette**: Dark Mode by default. High-contrast, but sophisticated (e.g., Slate, Emerald, and Gold accents).
- **Typography**: Google Fonts (Inter, Outfit, or Roboto).
- **Effects**: Glassmorphism, smooth gradients, and micro-animations (Framer Motion).
- **Visuals**: Use `generate_image` for realistic data visualizations or UI mockups.

## 📊 Project Insight Goals (Correlation Focus)

1. **Academic Performance vs. Study Time**: Correlation between `logs.category='study'` and `grades.score`.
2. **Habit Impact**: Alcohol consumption vs. sleep quality and mood.
3. **Driving vs. Spend**: Correlation between driving miles (`logs.category='drive'`) and spending (`logs.category='spend'`).
4. **Passive Capture**: Prioritize data flowing from iOS Shortcuts (via Supabase REST API).

## 🛠️ Specialized Skills & Workflows

| Slash Command | Usage |
| :--- | :--- |
| `/brainstorming` | **MANDATORY** before any new feature or component design. |
| `/ckm:ui-styling` | Use for shadcn/ui + Tailwind components. |
| `/ckm:design` | Use for brand identity and design tokens. |
| `/frontend-design` | Use for high-fidelity interactive interfaces. |
| `/webapp-testing` | Use for verifying frontend functionality with Playwright. |
| `/systematic-debugging` | Use for any bug or unexpected UI/database behavior. |

## 📦 Data Schema Reference (Supabase)

- **`logs`**: Event-based tracking (`study`, `drive`, `drink`, `workout`, `spend`).
- **`daily_summaries`**: Daily values (`sleep_hrs`, `mood`, `energy`, `screen_hrs`).
- **`grades`**: Academic performance metrics.

---

## 📅 Build Priorities

1. **Data Ingestion**: Ensure iOS Shortcut endpoints are robust (handled in Supabase).
2. **Unified UI**: Harmonize all pages with the "Quantified" palette.
3. **Correlation Engine**: Build the logic that links study time to grade outcomes.
4. **Edge Functions**: Deploy functions if custom logic for alerts or processing is needed.

## 🔍 Security & Performance

- **Security**: RLS is mandatory.
- **Latency**: Keep dashboard load times under 1 second.

---

## Life Dashboard — Full Project Plan

## Project Overview

A personal life tracking system that passively collects data across 8 categories, stores everything in a Supabase PostgreSQL database, and surfaces insights through three output layers: a private Next.js dashboard site, an iOS phone widget, and on-demand AI analysis via Claude. The system is designed around minimal friction — most data is captured passively or with a single tap.

---

## Goals

The three core insight goals driving every design decision:

1. **Am I studying enough relative to my grades?** — requires study time and grades both in the database to correlate
2. **Am I drinking too much on average?** — trends and weekly averages over time
3. **Spot correlations I wouldn't notice myself** — AI queries across multiple categories simultaneously (e.g. sleep vs mood, screen time vs drinks, study hours vs exam scores)

---

## What Gets Tracked

| Category | Collection Method | Effort Level |
| :--- | :--- | :--- |
| Study time | iOS Shortcut triggers on Blackboard or PDF reader app open/close | Passive |
| Driving miles | iOS Shortcut triggers on car Bluetooth connect/disconnect | Passive |
| Drinks / alcohol | Existing BAC tracker app (iOS Shortcuts), migrated to POST to Supabase | 1 tap |
| Workouts | iOS Shortcut triggers on gym location arrival/departure | Passive |
| Sleep | Apple Health export via Shortcut each morning | Passive |
| Screen time | iOS Screen Time export via Shortcut each evening | Passive |
| Spending | iOS Shortcut prompts when user opens their bank app | 1 tap |
| Mood / energy | Morning push notification with 1–5 scale tap | 1 tap |
| Grades | Manual entry form on the dashboard site after each exam | Manual |

Philosophy: passive capture beats manual logging. Every automation must have a clear fallback so that if it fails, no broken or partial data ends up in the database.

---

## Database (Supabase)

Host on Supabase (free tier is more than sufficient — personal life logs are text/numbers only, storage will not exceed a few MB per year).

### Table 1: logs

Handles all event-based tracking (study sessions, drives, drinks, workouts, spending).

```sql
CREATE TABLE logs (
  id          bigint generated always as identity primary key,
  created_at  timestamptz default now(),
  category    text,        -- 'study', 'drive', 'drink', 'workout', 'spend'
  event       text,        -- 'start', 'stop', or a direct value like '1' for a drink count
  value       numeric,     -- miles, minutes, dollar amount, count, etc.
  notes       text         -- optional context, usually null
);
```

New categories never require a schema change — just use a new string in the category column.

### Table 2: daily_summaries

Handles metrics that are naturally one value per day rather than discrete events.

```sql
CREATE TABLE daily_summaries (
  date        date primary key,
  sleep_hrs   numeric,
  mood        int,        -- 1 to 5 scale
  energy      int,        -- 1 to 5 scale
  screen_hrs  numeric
);
```

### Table 3: grades

Handles academic performance, necessary for the study-to-grade correlation insight.

```sql
CREATE TABLE grades (
  id          bigint generated always as identity primary key,
  date        date,
  course      text,       -- e.g. 'ECE 515', 'ENGR 205'
  exam_type   text,       -- 'quiz', 'midterm', 'final', 'homework'
  score       numeric,
  max_score   numeric
);
```

### Security

Enable Row Level Security (RLS) on all three tables in Supabase so the REST API rejects any unauthenticated request, even if someone discovers the project URL.

---

## iOS Data Collection (Shortcuts App)

### Driving Miles

- Trigger: iPhone connects to car Bluetooth
- Action: Log timestamp and starting location silently
- Trigger on disconnect: Calculate distance via Maps, POST to `logs` table with category='drive', value=miles

### Study Time

- Trigger: User opens Blackboard, PDF reader, or similar study app
- Action: Prompt "Starting a study session?" with 1-tap confirm
- On app close: Log end time, calculate duration, POST to `logs` with category='study'

### Workout

- Trigger: iPhone arrives at gym location (geofence)
- Action: Log start time silently
- On departure: Log end time, POST to `logs` with category='workout'

### Spending

- Trigger: User opens bank app
- Action: Show prompt asking for spending amount and category
- Action: POST to `logs` with category='spend', value=dollar amount

### Mood and Energy

- Trigger: Morning push notification (scheduled, e.g. 8:00 am)
- Action: Tap to open Shortcut, select mood 1–5 and energy 1–5
- Action: POST to `daily_summaries` for today's date

### Sleep and Screen Time

- These are pulled from Apple Health / iOS Screen Time on demand via Shortcut
- Can also be automated to POST to `daily_summaries` each morning/evening
- Lower priority — implement after other automations are stable

### Drinks / BAC Tracker

- User already has a working iOS Shortcuts BAC tracker
- Migration task: update existing Shortcut to also POST each drink event to Supabase `logs` with category='drink', event='1'

### Supabase REST API Call Template (for all Shortcuts)

Every Shortcut POSTs to the Supabase REST endpoint:

```http
POST https://[YOUR_PROJECT_REF].supabase.co/rest/v1/logs
Headers:
  apikey: [SUPABASE_ANON_KEY]
  Authorization: Bearer [SUPABASE_ANON_KEY]
  Content-Type: application/json
  Prefer: return=minimal

Body:
{
  "category": "drive",
  "event": "trip",
  "value": 12.4,
  "notes": ""
}
```

For daily_summaries, POST to `.../rest/v1/daily_summaries` with upsert behavior on the date field.

---

## Dashboard Site

### Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Database client:** Supabase JS client (@supabase/supabase-js)
- **Auth:** NextAuth.js with a single user credential (no public signup)
- **Deployment:** Vercel (separate project from portfolio)

This is a standalone site, completely separate from the user's existing portfolio.

### Design Aesthetic

Dark background, sharp typography, data-dense but clean. Think linear.app meets a personal analytics tool. It should look impressive — like something you'd want to show someone — while remaining completely private behind a login.

### Pages

#### `/` — Today

- Live stats for the current day: study hours so far, drink count, workout status, spending total
- Mood and energy rating for today
- A summary card showing how today compares to the weekly average for each metric

#### `/week` — Weekly Overview

- Charts for each tracked category over the past 7 days
- The weekly AI summary (generated by n8n Sunday night) rendered as a card
- Drink count vs weekly average with a visual indicator if above average

#### `/trends` — Long-term Trends

- Study hours per week over the semester
- Sleep hours vs mood scatter plot
- Drinks per week trend line
- Spending breakdown by week

#### `/grades` — Academic

- Manual entry form: course, exam type, score, max score, date
- Grade history table
- Study hours logged in the 3 days before each exam overlaid on grade results (this is the core correlation view)

#### `/insights` — AI Chat

- Input field to ask Claude anything about your data
- Streamed response from Claude API
- Claude queries Supabase directly to answer questions like "how many hours did I study last week vs the week before" or "what is my average drinks per night on weekends"

### Auth

Single user, single set of credentials. Use NextAuth with a credentials provider or GitHub OAuth. No public registration. The Vercel deployment URL is not listed anywhere public, and Supabase RLS is the second layer of protection.

---

## AI Insights Layer

### On-Demand (Claude via Supabase MCP)

The user already has Supabase connected to Claude via MCP in Claude Desktop. Once data is flowing into the database, the user can ask Claude directly in natural language and Claude will query the database and return real answers. No additional infrastructure required for this layer.

Example queries:

- "The weeks I studied under 8 hours, what were my exam scores that followed?"
- "Do I drink more on weeks with high screen time?"
- "What is my average mood on days after fewer than 6 hours of sleep?"
- "How has my study time trended over the past month?"

### Automated Weekly Report (n8n)

- Runs every Sunday night via n8n scheduled workflow
- n8n queries Supabase for all data from the past 7 days across all three tables
- Sends that data to the Claude API (claude-sonnet-4-20250514) with a prompt asking for a concise habit summary and any notable correlations or anomalies
- Delivers a 5-bullet plain-language summary to the user via iMessage or email
- This summary is also written back to a `weekly_reports` table in Supabase so the `/week` page on the dashboard can display it

Prompt structure for the weekly n8n call:

```markdown
You are a personal analytics assistant. Here is one week of life tracking data for a 21-year-old college student:

[JSON dump of logs, daily_summaries, and grades for the past 7 days]

Provide exactly 5 bullet points covering:
1. Study time summary and whether it was above or below the previous week
2. Drinking pattern — average drinks per night out, any concerning trends
3. Sleep and mood correlation if notable
4. One unexpected or interesting correlation you noticed across categories
5. One concrete recommendation for next week based on the data
```

---

## Build Order

Do not try to build everything at once. Follow this sequence to always have a working, useful system at each step.

| Phase | Task | Notes |
| :--- | :--- | :--- |
| 1 | Create Supabase project, run all three table SQL statements, enable RLS, copy API keys | 20 minutes, everything depends on this |
| 2 | Migrate existing BAC tracker Shortcut to POST to Supabase | Easiest win, already built |
| 3 | Build driving Bluetooth Shortcut | Most passive, high value |
| 4 | Build mood morning notification Shortcut | Gets daily data flowing immediately |
| 5 | Build study time Shortcut | Needs tuning to reliably detect study sessions |
| 6 | Build workout location Shortcut | |
| 7 | Build spending bank-app Shortcut | |
| 8 | Scaffold Next.js dashboard, build Today and Week pages | Build once 2 to 3 weeks of data exists |
| 9 | Build Grades page with manual entry and study correlation view | Needs data to be meaningful |
| 10 | Build Trends and Insights pages | |
| 11 | Set up n8n weekly report workflow | Last — aggregates everything |
| 12 | Build Scriptable phone widget | Nice to have once dashboard is done |

---

## Phone Widget

Built with the Scriptable app (free, JavaScript-based). Queries the Supabase REST API directly and renders a summary card on the iOS home screen. Refreshes every 30 minutes.

Display format:

```text
Today — [Day, Date]
Study    2h 14m
Drive    18.3 mi
Drinks   2
Mood     4/5
Spend    $34
```

---

## Tech Stack Summary

| Layer | Technology |
| :--- | :--- |
| Database | Supabase (PostgreSQL) |
| Data collection | iOS Shortcuts |
| Automation / weekly report | n8n |
| Dashboard framework | Next.js (App Router) |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Auth | NextAuth.js |
| Deployment | Vercel |
| Phone widget | Scriptable (JavaScript) |
| AI queries | Claude via Supabase MCP (on-demand) + Claude API via n8n (weekly) |

---

## Environment Variables Needed

```env
NEXT_PUBLIC_SUPABASE_URL=https://[ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon key]
SUPABASE_SERVICE_ROLE_KEY=[service role key — server-side only, never exposed to client]
NEXTAUTH_SECRET=[random string]
NEXTAUTH_URL=https://[your-dashboard-domain].vercel.app
```

---

## Notes for the Builder

- The user is comfortable with Next.js, Vercel, iOS Shortcuts, and has existing MCP server infrastructure on their machine
- The user already has a working BAC tracker in iOS Shortcuts — migrate it rather than rebuilding it
- Every Shortcut automation needs error handling so a failed POST does not leave a broken session row in the database (e.g. a study session with a start but no stop)
- Supabase's built-in REST API is sufficient — no need for a custom backend or API routes for data ingestion from Shortcuts
- Keep the database schema simple — the single logs table with a category string handles all event types without needing separate tables per category
- Build the dashboard after real data exists — charts with no data are not useful for validating the design
