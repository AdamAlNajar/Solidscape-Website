/*
  Solidscape Contracting LTD - client-side behaviour shared by every page.

  Mouse-event features:
    1. toggleMenu()     - click the ☰ button to open/close the mobile nav.
    2. goTo()           - click the arrows or dots (or swipe) to move through a project's photos.
    3. openLightbox()   - click a project photo on the showcase page to view it full size.
    4. closeLightbox()  - click the dark background or × button to close it again.

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
  setUpCarousels(); // must run before setUpLightbox(), which uses the photo buttons it creates
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

/* ---------- 2. Showcase photo carousels ---------- */

/*
  Each project card has a <div class="carousel"> holding a list of photos.
  To add a photo, add another <li><img src="..." alt="..."></li> to that list -
  this code counts the photos and builds the arrows, dots and counter for you.

  Accessibility (follows the WAI-ARIA Authoring Practices carousel pattern):
    - the carousel is a labelled region and each photo is a labelled "slide"
    - real <button>s for previous / next / each dot, with clear labels
    - left/right arrow keys move between photos when the carousel has focus
    - a polite live region tells screen-reader users which photo is showing
    - photos that are off screen are made inert so Tab skips them
    - no auto-play, and no sliding animation if the visitor prefers reduced motion
  On phones the photos can also be swiped (CSS scroll-snap, see styles.css).
*/

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function setUpCarousels() {
  document.querySelectorAll('.carousel').forEach((carousel, number) => {
    setUpCarousel(carousel, number + 1);
  });
}

function setUpCarousel(carousel, number) {
  const track = carousel.querySelector('.carousel-track');
  const slides = Array.from(track.children);
  const total = slides.length;
  let current = 0;

  track.id = `carousel-track-${number}`;
  carousel.setAttribute('role', 'region');
  carousel.setAttribute('aria-roledescription', 'carousel');

  slides.forEach((slide, index) => {
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${index + 1} of ${total}`);
    wrapPhotoInButton(slide.querySelector('img'));
  });

  // A single photo needs no arrows or dots
  if (total < 2) return;

  carousel.classList.add('has-controls');

  // Previous / next arrow buttons
  const prevButton = makeButton('carousel-arrow carousel-prev', 'Previous photo', '‹');
  const nextButton = makeButton('carousel-arrow carousel-next', 'Next photo', '›');
  prevButton.setAttribute('aria-controls', track.id);
  nextButton.setAttribute('aria-controls', track.id);
  prevButton.addEventListener('click', () => goTo(current - 1));
  nextButton.addEventListener('click', () => goTo(current + 1));

  // One dot per photo, so the visitor can jump straight to any photo
  const dots = document.createElement('div');
  dots.className = 'carousel-dots';
  const dotButtons = slides.map((slide, index) => {
    const dot = makeButton('carousel-dot', `Show photo ${index + 1} of ${total}`, '');
    dot.setAttribute('aria-controls', track.id);
    dot.addEventListener('click', () => goTo(index));
    dots.appendChild(dot);
    return dot;
  });

  // Visible "1 / 4" counter (hidden from screen readers - the live region says it instead)
  const counter = document.createElement('span');
  counter.className = 'carousel-counter';
  counter.setAttribute('aria-hidden', 'true');

  // Screen readers announce whatever text is put in here
  const status = document.createElement('p');
  status.className = 'sr-only';
  status.setAttribute('aria-live', 'polite');

  carousel.append(prevButton, nextButton, dots, counter, status);

  // Scrolls the track to a photo. Going past either end wraps round, so the
  // arrow buttons never become disabled (which would lose keyboard focus).
  function goTo(index) {
    const target = (index + total) % total;
    track.scrollTo({
      left: target * track.clientWidth,
      behavior: reduceMotion.matches ? 'auto' : 'smooth'
    });
    showSlide(target, true);
  }

  // Updates the dots, counter and hidden slides to match the photo on screen
  function showSlide(index, announce) {
    current = index;

    slides.forEach((slide, i) => {
      const isCurrent = i === index;
      slide.inert = !isCurrent;
      slide.setAttribute('aria-hidden', String(!isCurrent));
    });
    dotButtons.forEach((dot, i) => {
      if (i === index) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    counter.textContent = `${index + 1} / ${total}`;
    if (announce) status.textContent = `Photo ${index + 1} of ${total}`;
  }

  // Swiping on a phone scrolls the track, so work out which photo is now showing.
  // Waits until scrolling has stopped so photos passed on the way aren't announced.
  let scrollTimer;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const index = Math.round(track.scrollLeft / track.clientWidth);
      if (index !== current) showSlide(index, true);
    }, 120);
  }, { passive: true });

  // Left / right arrow keys work anywhere inside the carousel
  carousel.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(current - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      goTo(current + 1);
    }
  });

  // Keep the same photo lined up if the screen is resized or rotated
  window.addEventListener('resize', () => {
    track.scrollLeft = current * track.clientWidth;
  });

  showSlide(0, false);
}

// Creates a <button> with a screen-reader label and optional visible text
function makeButton(className, label, text) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.setAttribute('aria-label', label);
  button.textContent = text;
  return button;
}

// Puts each photo inside a button so keyboard users can open it in the lightbox too
function wrapPhotoInButton(img) {
  if (!img) return;
  const button = makeButton('photo-button', `View full size: ${img.alt}`, '');
  img.replaceWith(button);
  button.appendChild(img);
}

/* ---------- 3. Showcase photo lightbox ---------- */

let lightboxOpener = null; // the photo button that opened the lightbox

function setUpLightbox() {
  const lightbox = document.querySelector('#lightbox');
  if (!lightbox) return; // only the showcase page has a lightbox

  // Clicking any project photo (or pressing Enter/Space on it) opens the lightbox
  document.querySelectorAll('.photo-button').forEach(button => {
    button.addEventListener('click', () => openLightbox(button));
  });

  // Clicking the dark background or the × button closes it.
  // Clicks on the photo itself are ignored so it doesn't close by accident.
  lightbox.addEventListener('click', event => {
    if (event.target !== document.querySelector('#lightbox-image')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', event => {
    if (lightbox.hidden) return;
    // Keyboard users can close it with Escape
    if (event.key === 'Escape') closeLightbox();
    // The × is the only control, so keep Tab focus on it instead of the page behind
    if (event.key === 'Tab') {
      event.preventDefault();
      lightbox.querySelector('.lightbox-close').focus();
    }
  });
}

function openLightbox(button) {
  const img = button.querySelector('img');
  const lightbox = document.querySelector('#lightbox');
  const bigImage = document.querySelector('#lightbox-image');
  const caption = document.querySelector('#lightbox-caption');

  // Use the project title and type from the same card as the caption
  const card = button.closest('.project-card');
  const title = card.querySelector('h3').textContent;
  const type = card.querySelector('.project-type').textContent;
  const slide = button.closest('li');
  const photoCount = slide.parentElement.children.length;
  const position = photoCount > 1 ? ` (photo ${slide.getAttribute('aria-label')})` : '';

  bigImage.src = img.src;
  bigImage.alt = img.alt;
  caption.textContent = `${title} - ${type}${position}`;
  lightboxOpener = button;
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden'; // stop the page scrolling behind it
  lightbox.querySelector('.lightbox-close').focus();
}

function closeLightbox() {
  document.querySelector('#lightbox').hidden = true;
  document.body.style.overflow = '';
  // Put keyboard focus back on the photo that was opened
  if (lightboxOpener) lightboxOpener.focus();
  lightboxOpener = null;
}

/* ---------- 4. Contact form ---------- */

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
