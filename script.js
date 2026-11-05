document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  const menuButton = document.querySelector('.menu-toggle');
  const navbar = document.querySelector('.navbar');
  if (menuButton && navbar) {
    menuButton.addEventListener('click', () => {
      const isOpen = navbar.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });
  }

    const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', async event => {
      // Client-side validation
      let valid = true;
      
      // Clear previous error messages
      form.querySelectorAll('.error-message').forEach(el => el.remove());
      
      // Validate name
      const nameInput = form.querySelector('#name');
      if (!nameInput.value.trim()) {
        showError(nameInput, 'Name is required');
        valid = false;
      } else if (nameInput.value.trim().length > 120) {
        showError(nameInput, 'Name is too long (max 120 characters)');
        valid = false;
      }
      
      // Validate email
      const emailInput = form.querySelector('#email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim()) {
        showError(emailInput, 'Email is required');
        valid = false;
      } else if (!emailRegex.test(emailInput.value.trim())) {
        showError(emailInput, 'Please enter a valid email address');
        valid = false;
      } else if (emailInput.value.trim().length > 254) {
        showError(emailInput, 'Email is too long (max 254 characters)');
        valid = false;
      }
      
      // Validate subject
      const subjectSelect = form.querySelector('#subject');
      if (!subjectSelect.value) {
        showError(subjectSelect, 'Please select a topic');
        valid = false;
      }
      
      // Validate message
      const messageTextarea = form.querySelector('#message');
      if (!messageTextarea.value.trim()) {
        showError(messageTextarea, 'Message is required');
        valid = false;
      } else if (messageTextarea.value.trim().length > 4000) {
        showError(messageTextarea, 'Message is too long (max 4000 characters)');
        valid = false;
      } else if (messageTextarea.value.trim().length < 10) {
        showError(messageTextarea, 'Message is too short (min 10 characters)');
        valid = false;
      }
      
      if (!valid) {
        event.preventDefault();
        return;
      }

      const status = document.querySelector('#form-status');
      const submit = form.querySelector('button[type="submit"]');
      const payload = Object.fromEntries(new FormData(form).entries());
      status.textContent = 'Sending your enquiry…';
      submit.disabled = true;
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(payload)
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || 'Unable to send your enquiry right now.');
        status.textContent = 'Thank you. Your enquiry has been sent.';
        form.reset();
      } catch (error) {
        status.textContent = 'The form could not be sent. Please try again later or contact us directly.';
      } finally {
        submit.disabled = false;
      }
    });
  }
});

// Helper function to show error messages
function showError(input, message) {
  // Remove any existing error for this input
  const existingError = input.parentElement.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }
  
  // Create and add error message
  const errorElement = document.createElement('span');
  errorElement.className = 'error-message';
  errorElement.style.color = '#ff0000';
  errorElement.style.fontSize = '11px';
  errorElement.style.marginTop = '4px';
  errorElement.textContent = message;
  
  input.parentElement.appendChild(errorElement);
  input.style.borderColor = '#ff0000';
}