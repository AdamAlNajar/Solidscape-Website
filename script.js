/*
  Solidscape Contracting LTD - client-side behaviour shared by every page.

  Mouse-event features:
    1. toggleMenu()     - click the ☰ button to open/close the mobile nav.
    2. openLightbox()   - click a project photo on the showcase page to view it full size.
    3. closeLightbox()  - click the dark background or × button to close it again.

  Form features (contact page only):
    - validateForm() checks presence, length and range before anything is sent.
    - updateCharCount() shows how many characters the message has.
*/

// Limits used by the validation. The same limits are checked again in server.js.
const LIMITS = {
  nameMax: 120,
  emailMax: 254,
  phoneMax: 40,
  messageMin: 10,
  messageMax: 4000
};

document.addEventListener('DOMContentLoaded', () => {
  // Fill every <span data-year> in the footer with the current year
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  setUpMenu();
  setUpLightbox();
  setUpContactForm();
});

/* ---------- 1. Mobile navigation menu ---------- */

function setUpMenu() {
  const menuButton = document.querySelector('.menu-toggle');
  const navbar = document.querySelector('.navbar');
  if (!menuButton || !navbar) return;

  menuButton.addEventListener('click', () => toggleMenu(menuButton, navbar));
}

// Shows or hides the nav links and keeps the button's screen-reader label accurate
function toggleMenu(menuButton, navbar) {
  const isOpen = navbar.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  menuButton.textContent = isOpen ? '✕' : '☰';
}

/* ---------- 2. Showcase photo lightbox ---------- */

function setUpLightbox() {
  const lightbox = document.querySelector('#lightbox');
  if (!lightbox) return; // only the showcase page has a lightbox

  // Clicking any project photo opens it in the lightbox
  document.querySelectorAll('.project-image img').forEach(img => {
    img.addEventListener('click', () => openLightbox(img));
  });

  // Clicking the dark background or the × button closes it.
  // Clicks on the photo itself are ignored so it doesn't close by accident.
  lightbox.addEventListener('click', event => {
    if (event.target !== document.querySelector('#lightbox-image')) {
      closeLightbox();
    }
  });

  // Keyboard users can close it with Escape
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !lightbox.hidden) closeLightbox();
  });
}

function openLightbox(img) {
  const lightbox = document.querySelector('#lightbox');
  const bigImage = document.querySelector('#lightbox-image');
  const caption = document.querySelector('#lightbox-caption');

  // Use the project title and description from the same card as the caption
  const card = img.closest('.project-card');
  const title = card.querySelector('h3').textContent;
  const type = card.querySelector('.project-type').textContent;

  bigImage.src = img.src;
  bigImage.alt = img.alt;
  caption.textContent = `${title} - ${type}`;
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden'; // stop the page scrolling behind it
  lightbox.querySelector('.lightbox-close').focus();
}

function closeLightbox() {
  document.querySelector('#lightbox').hidden = true;
  document.body.style.overflow = '';
}

/* ---------- 3. Contact form ---------- */

function setUpContactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return; // only the contact page has the form

  const message = form.querySelector('#message');
  message.addEventListener('input', () => updateCharCount(message));

  // Remove a field's error as soon as the visitor starts fixing it
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => clearError(field));
    field.addEventListener('change', () => clearError(field));
  });

  form.addEventListener('submit', async event => {
    event.preventDefault(); // we send the form ourselves with fetch()

    if (!validateForm(form)) {
      // Move the cursor to the first problem so the visitor can fix it
      form.querySelector('.input-error')?.focus();
      return;
    }
    await sendForm(form);
  });
}

// Live "x / 4000 characters" counter under the message box
function updateCharCount(textarea) {
  const counter = document.querySelector('#message-count');
  const length = textarea.value.trim().length;
  counter.textContent = `${length} / ${LIMITS.messageMax} characters (minimum ${LIMITS.messageMin})`;
}

// Returns true when every field passes. Shows a message under each field that fails.
function validateForm(form) {
  let valid = true;
  form.querySelectorAll('input, select, textarea').forEach(clearError);

  // Name: presence + length check
  const name = form.querySelector('#name');
  const nameValue = name.value.trim();
  if (!nameValue) {
    valid = showError(name, 'Please enter your name.');
  } else if (nameValue.length < 2) {
    valid = showError(name, 'Name must be at least 2 characters.');
  } else if (nameValue.length > LIMITS.nameMax) {
    valid = showError(name, `Name must be ${LIMITS.nameMax} characters or fewer.`);
  }

  // Email: presence + format + length check
  const email = form.querySelector('#email');
  const emailValue = email.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailValue) {
    valid = showError(email, 'Please enter your email address.');
  } else if (!emailPattern.test(emailValue)) {
    valid = showError(email, 'Please enter a valid email address, e.g. name@example.com.');
  } else if (emailValue.length > LIMITS.emailMax) {
    valid = showError(email, `Email must be ${LIMITS.emailMax} characters or fewer.`);
  }

  // Phone (optional): if filled in, only digits, spaces, + ( ) - and 7-15 digits
  const phone = form.querySelector('#phone');
  const phoneValue = phone.value.trim();
  const digitCount = phoneValue.replace(/\D/g, '').length;
  if (phoneValue && (!/^[+\d\s()-]+$/.test(phoneValue) || digitCount < 7 || digitCount > 15)) {
    valid = showError(phone, 'Please enter a valid phone number (7 to 15 digits).');
  }

  // Topic: presence check
  const subject = form.querySelector('#subject');
  if (!subject.value) {
    valid = showError(subject, 'Please choose a topic.');
  }

  // Message: presence + length range check
  const message = form.querySelector('#message');
  const messageLength = message.value.trim().length;
  if (!messageLength) {
    valid = showError(message, 'Please tell us about your project.');
  } else if (messageLength < LIMITS.messageMin) {
    valid = showError(message, `Message is too short (minimum ${LIMITS.messageMin} characters).`);
  } else if (messageLength > LIMITS.messageMax) {
    valid = showError(message, `Message is too long (maximum ${LIMITS.messageMax} characters).`);
  }

  // Start date (optional): range check - cannot be in the past
  const startDate = form.querySelector('#startDate');
  if (startDate.value) {
    // Today's local date as "YYYY-MM-DD" (adjusted so UTC doesn't give yesterday's date)
    const now = new Date();
    const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    if (startDate.value < today) {
      valid = showError(startDate, 'Start date cannot be in the past.');
    }
  }

  return valid;
}

// Posts the form to the Express server (server.js) and shows the result
async function sendForm(form) {
  const status = document.querySelector('#form-status');
  const submit = form.querySelector('button[type="submit"]');
  const payload = Object.fromEntries(new FormData(form).entries());

  status.className = 'form-status';
  status.textContent = 'Sending your enquiry…';
  submit.disabled = true;

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'Unable to send your enquiry right now.');

    status.classList.add('success');
    status.textContent = 'Thank you. Your enquiry has been sent - we will reply soon.';
    form.reset();
    updateCharCount(form.querySelector('#message'));
  } catch (error) {
    status.classList.add('failure');
    status.textContent = 'The form could not be sent. Please try again later or contact us on WhatsApp.';
  } finally {
    submit.disabled = false;
  }
}

// Adds a red message under a field. Returns false so it can be used as `valid = showError(...)`.
function showError(field, message) {
  clearError(field);
  const error = document.createElement('span');
  error.className = 'error-message';
  error.id = `${field.id}-error`;
  error.textContent = message;
  field.insertAdjacentElement('afterend', error);
  field.classList.add('input-error');
  field.setAttribute('aria-invalid', 'true');
  field.setAttribute('aria-describedby', error.id);
  return false;
}

// Removes the error message (if any) from a single field
function clearError(field) {
  const next = field.nextElementSibling;
  if (next && next.classList.contains('error-message')) next.remove();
  field.classList.remove('input-error');
  field.removeAttribute('aria-invalid');
  field.removeAttribute('aria-describedby');
}
