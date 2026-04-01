# iOS Shortcuts Data Ingestion Guide

To log data from your iPhone/iPad directly to your Life Dashboard, use the **"Get Contents of URL"** action in the Shortcuts app.

## Connection Details
- **Base URL**: `https://tuxeowluvalaismbwwed.supabase.co/rest/v1`
- **Method**: `POST`
- **Headers**:
    - `apikey`: `<YOUR_ANON_KEY>`
    - `Authorization`: `Bearer <YOUR_ANON_KEY>`
    - `Content-Type`: `application/json`
    - `Prefer`: `return=representation`

> [!TIP]
> Use your `NEXT_PUBLIC_SUPABASE_ANON_KEY` from your `.env.local` file for the `<YOUR_ANON_KEY>` placeholder.

---

## 1. Study Session / Log Entry
**Endpoint**: `/logs`

**JSON Payload**:
```json
{
  "category": "study",
  "event": "start",
  "notes": "Deep work session"
}
```
*Categories: `study`, `drive`, `drink`, `workout`, `spend`*

## 2. Daily Summary (Sleep/Mood/Energy)
**Endpoint**: `/daily_summaries`

**JSON Payload**:
```json
{
  "date": "2024-04-01",
  "sleep_hrs": 7.5,
  "mood": 4,
  "energy": 3,
  "screen_hrs": 2.4
}
```
*Note: `date` should be in `YYYY-MM-DD` format (Shortcuts can output this).*

## 3. Grade Entry
**Endpoint**: `/grades`

**JSON Payload**:
```json
{
  "date": "2024-04-01",
  "course": "Math 101",
  "exam_type": "Midterm",
  "score": 92,
  "max_score": 100
}
```

---

## Shortcut Flow Example:
1. **Date**: Get Current Date -> Format: `ISO 8601 (YYYY-MM-DD)`
2. **Value**: Ask for Input (Number)
3. **Dictionary**: Create Dictionary with fields (e.g., `date`, `sleep_hrs`)
4. **Network**: Get Contents of `https://tuxeowluvalaismbwwed.supabase.co/rest/v1/daily_summaries`
    - Method: `POST`
    - Headers: (Add `apikey` and `Authorization`)
    - Request Body: JSON -> File (the dictionary)
