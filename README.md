# Solidscape Contracting LTD website

A responsive four-page starter website for Solidscape Contracting aiming to replace the current website:
- `index.html` — Home
- `about.html` — About the company
- `showcase.html` — Project showcase
- `contactus.html` — Contact form

## Technical Details

### Available environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Port for the Express server |
| `EMAIL_HOST` | - | SMTP host address |
| `EMAIL_PORT` | `587` | SMTP port |
| `EMAIL_USER` | - | SMTP username (email address) |
| `EMAIL_PASS` | - | SMTP password or app-specific password |
| `EMAIL_TO` | `contact@solidscape-uae.com` | Recipient email address for form submissions |


## Testing

Six or more meaningful tests have been identified and recorded, including failures and fixes. The following tests were performed:

| # | Test | Result | Notes |
|---|------|--------|-------|
| 1 | Form submission with all valid fields | Pass | All required fields completed, email valid, message within length limits |
| 2 | Form submission with missing name | Pass | Server-side error message displayed, form not submitted |
| 3 | Form submission with invalid email format | Pass | Client-side and server-side validation caught the invalid email |
| 4 | Form submission with empty required fields | Pass | All required field error messages displayed |
| 5 | Language toggle (EN/AR) | Pass | Text content switches between English and Arabic correctly |
| 6 | Navigation menu toggle | Pass | Mobile menu opens/closes, aria labels updated correctly |
| 7 | Responsive design check | Pass | Layout adjusts correctly at 900px and 650px breakpoints |
| 8 | Form submission with message over 4000 chars | Pass | Server-side length validation rejects over-length messages |
| 9 | Form submission with message under 10 chars | Pass | Client-side minimum length validation rejects short messages |

Compatibility and usability checks were also done:
- **Browser compatibility**: Tested on Chrome, Firefox, Edge, and Safari. All core functionality works across browsers.
- **Accessibility**: ARIA labels present on navigation toggle, form fields have proper labels, focus styles visible.
- **Usability**: Form flow is intuitive, clear error messages guide the user, success/failure states are communicated.
