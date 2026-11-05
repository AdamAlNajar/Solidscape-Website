# Testing

Tests were run against the local server (`npm start`). For form tests the
email settings were left blank so no real emails were sent — the server then
replies "Contact form is not configured yet", which proves the request got
past validation.

## Functional tests

| # | What was tested | Steps / input | Expected result | Actual result | Pass? | Fix (if it failed) |
|---|---|---|---|---|---|---|
| 1 | All four pages load and are linked | Open each page, click every nav and footer link | Every link opens the right page, no 404s | All pages loaded, all links worked | ✅ | – |
| 2 | Empty form submitted | Click **Send enquiry** with every field empty | A message under Name, Email, Topic and Message | **First attempt: no custom messages appeared.** The browser's own `required` pop-up stopped the submit event, so `script.js` never ran. | ❌ → ✅ | Added `novalidate` to the `<form>` so our own validation runs and shows clear messages under each field. Retested: all 4 messages appear. |
| 3 | Invalid email | Email = `bad@` | "Please enter a valid email address…" | Message shown, form not sent | ✅ | – |
| 4 | Message length check (too short) | Message = `hi` | "Message is too short (minimum 10 characters)" | Message shown, counter showed `2 / 4000` | ✅ | – |
| 5 | Message length check (too long, server) | POST a 4001-character message directly to `/api/contact` | Server rejects with 400 | `400 One or more fields are too long.` | ✅ | – |
| 6 | Start date range check | Start date = 01/01/2020 | "Start date cannot be in the past." | Message shown | ✅ | – |
| 7 | Valid form | Name, valid email, topic, 20+ char message | Passes validation and is posted to the server | No validation errors; request reached the server (which returned 503 because email was switched off for testing) and the failure message was shown | ✅ | – |
| 8 | Server only accepts listed reply methods | POST `contactMethod: "Fax"` | 400 error | `400 Invalid contact method.` | ✅ | – |
| 9 | Photo lightbox (mouse event) | Click Project Two photo, then click the dark background | Photo opens large with caption, then closes | Opened with caption "Project Two - Interior Upgrade", closed on background click | ✅ | – |
| 10 | Mobile menu (mouse event) | At 375px wide, click ☰ | Nav links appear, button changes to ✕ | Nav shown, `aria-expanded="true"` | ✅ | – |
| 11 | Private files are not downloadable | Visit `/server.js`, `/package.json`, `/rubric.png`, `/.env` | 404 for all | **Before fix: `server.js`, `package.json` and the rubric images were served** because `express.static` shared the whole project folder. | ❌ → ✅ | Server now only serves the 4 HTML pages, `styles.css`, `script.js` and `assets/`. Retested: all 404. |
| 12 | Email content | Read `server.js` email code | Visitor's email address appears correctly | **Bug found:** the `safe()` function replaced every `@` with the text `@u200b`, so `adam@example.com` became `adam@u200bexample.com` in the email. | ❌ → ✅ | Replaced with a function that only removes line breaks (which is what actually prevents email header injection). |
| 13 | Footer brand name | Read footer on every page | "SOLIDSCAPE" | Footer said **"SOLIDSCALE"** on all 4 pages | ❌ → ✅ | Fixed the typo on every page. |

## Compatibility checks — two browsers, two screen widths

| Browser | Desktop (1366px) | Phone (375px) | Notes |
|---|---|---|---|
| Google Chrome | ✅ All pages render correctly | ✅ Single-column layout, no sideways scrolling (page width = 375px on Home, Our Work, Contact), ☰ menu works | Tested |
| _Second browser (e.g. Firefox / Edge / Safari)_ | _to do_ | _to do_ | _Fill in after testing – use the browser's responsive design mode (Ctrl+Shift+M in Firefox) for the phone width_ |

## Usability check — visitor task

Give someone who has not seen the site this task, watch without helping, and
record what happens.

**Task:** "You want a quote for a new kitchen. Find an example of a kitchen or
bathroom the company has done, then send them an enquiry asking for a quote."

| Tester | Time taken | Completed? | Where they hesitated / what they said | Change made afterwards |
|---|---|---|---|---|
| _to do_ | | | | |
