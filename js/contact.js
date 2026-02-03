// Contact Form Validation & Submission
// Accessible, keyboard-friendly form handling

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const formFields = document.getElementById('form-fields');
    const formSuccess = document.getElementById('form-success');
    const submitBtn = document.getElementById('submit-btn');
    const sendAnotherBtn = document.getElementById('send-another');

    // Form field references
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');
    const messageCounter = document.getElementById('message-counter');

    // Validation rules
    const MAX_MESSAGE_LENGTH = 1000;
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form) return;

    // ==============================
    // 1. CHARACTER COUNTER
    // ==============================
    if (messageInput && messageCounter) {
        messageInput.addEventListener('input', () => {
            const length = messageInput.value.length;
            messageCounter.textContent = `${length} / ${MAX_MESSAGE_LENGTH}`;

            if (length > MAX_MESSAGE_LENGTH) {
                messageCounter.classList.add('error');
                messageInput.classList.add('error');
            } else {
                messageCounter.classList.remove('error');
                if (!messageInput.dataset.touched) {
                    messageInput.classList.remove('error');
                }
            }
        });
    }

    // ==============================
    // 2. FIELD VALIDATION
    // ==============================

    /**
     * Validate a single field
     * @param {HTMLElement} input - The input element
     * @param {string} errorId - ID of the error message element
     * @returns {boolean} - Whether the field is valid
     */
    function validateField(input, errorId) {
        const errorEl = document.getElementById(errorId);
        let isValid = true;
        let errorMessage = '';

        const value = input.value.trim();

        // Mark as touched
        input.dataset.touched = 'true';

        // Required check
        if (input.required && !value) {
            isValid = false;
            errorMessage = `${getLabelText(input)} is required`;
        }
        // Email format check
        else if (input.type === 'email' && value && !EMAIL_REGEX.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
        // Message length check
        else if (input.id === 'contact-message' && value.length > MAX_MESSAGE_LENGTH) {
            isValid = false;
            errorMessage = `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`;
        }
        // Minimum length for message
        else if (input.id === 'contact-message' && value && value.length < 10) {
            isValid = false;
            errorMessage = 'Please provide a bit more detail (at least 10 characters)';
        }

        // Update UI
        if (isValid) {
            input.classList.remove('error');
            input.classList.add('valid');
            input.setAttribute('aria-invalid', 'false');
            if (errorEl) {
                errorEl.textContent = '';
                errorEl.classList.remove('visible');
            }
        } else {
            input.classList.add('error');
            input.classList.remove('valid');
            input.setAttribute('aria-invalid', 'true');
            if (errorEl) {
                errorEl.textContent = errorMessage;
                errorEl.classList.add('visible');
            }
        }

        return isValid;
    }

    /**
     * Get label text for an input
     */
    function getLabelText(input) {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (label) {
            // Remove asterisk and "(Optional)" from label text
            return label.textContent.replace(/\s*\*\s*|\s*\(Optional\)\s*/g, '').trim();
        }
        return input.name || 'This field';
    }

    /**
     * Validate all required fields
     * @returns {boolean} - Whether all fields are valid
     */
    function validateForm() {
        const nameValid = validateField(nameInput, 'name-error');
        const emailValid = validateField(emailInput, 'email-error');
        const messageValid = validateField(messageInput, 'message-error');

        return nameValid && emailValid && messageValid;
    }

    // ==============================
    // 3. REAL-TIME VALIDATION (on blur)
    // ==============================
    const requiredFields = [
        { input: nameInput, errorId: 'name-error' },
        { input: emailInput, errorId: 'email-error' },
        { input: messageInput, errorId: 'message-error' }
    ];

    requiredFields.forEach(({ input, errorId }) => {
        if (!input) return;

        // Validate on blur (leaving field)
        input.addEventListener('blur', () => {
            if (input.dataset.touched) {
                validateField(input, errorId);
            }
        });

        // Clear error on input if previously had error
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input, errorId);
            }
        });

        // Mark as touched on first interaction
        input.addEventListener('focus', () => {
            input.dataset.touched = 'true';
        }, { once: true });
    });

    // ==============================
    // 4. FORM SUBMISSION
    // ==============================
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate all fields
        if (!validateForm()) {
            // Focus first invalid field
            const firstError = form.querySelector('.form-input.error');
            if (firstError) {
                firstError.focus();
                // Announce error to screen readers
                announceError('Please fix the errors in the form before submitting.');
            }
            return;
        }

        // Show loading state
        setLoadingState(true);

        // Collect form data
        const formData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            subject: subjectInput?.value.trim() || '',
            message: messageInput.value.trim()
        };

        try {
            // Simulate API call (replace with actual endpoint)
            await simulateSubmission(formData);

            // Show success message
            showSuccess();

        } catch (error) {
            console.error('Form submission error:', error);
            announceError('Something went wrong. Please try again later.');
            setLoadingState(false);
        }
    });

    // ==============================
    // 5. UI HELPER FUNCTIONS
    // ==============================

    /**
     * Set loading state on submit button
     */
    function setLoadingState(isLoading) {
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        const btnIcon = submitBtn.querySelector('.btn-icon');

        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            if (btnText) btnText.hidden = true;
            if (btnLoading) btnLoading.hidden = false;
            if (btnIcon) btnIcon.style.display = 'none';
        } else {
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            if (btnText) btnText.hidden = false;
            if (btnLoading) btnLoading.hidden = true;
            if (btnIcon) btnIcon.style.display = '';
        }
    }

    /**
     * Show success message and hide form
     */
    function showSuccess() {
        formFields.hidden = true;
        formSuccess.hidden = false;
        formSuccess.focus();

        // Announce to screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = 'Your message has been sent successfully!';
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    }

    /**
     * Reset form to initial state
     */
    function resetForm() {
        form.reset();
        formFields.hidden = false;
        formSuccess.hidden = true;
        setLoadingState(false);

        // Clear validation states
        requiredFields.forEach(({ input, errorId }) => {
            if (!input) return;
            input.classList.remove('error', 'valid');
            input.removeAttribute('aria-invalid');
            delete input.dataset.touched;
            const errorEl = document.getElementById(errorId);
            if (errorEl) {
                errorEl.textContent = '';
                errorEl.classList.remove('visible');
            }
        });

        // Reset counter
        if (messageCounter) {
            messageCounter.textContent = `0 / ${MAX_MESSAGE_LENGTH}`;
            messageCounter.classList.remove('error');
        }

        // Focus first field
        nameInput?.focus();
    }

    /**
     * Announce error to screen readers
     */
    function announceError(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'alert');
        announcement.setAttribute('aria-live', 'assertive');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    }

    /**
     * Simulate form submission (replace with actual API call)
     */
    function simulateSubmission(data) {
        return new Promise((resolve, reject) => {
            console.log('Form data:', data);
            // Simulate network delay
            setTimeout(() => {
                // Simulate success (90% chance) or failure
                if (Math.random() > 0.1) {
                    resolve({ success: true });
                } else {
                    reject(new Error('Simulated network error'));
                }
            }, 1500);
        });
    }

    // ==============================
    // 6. SEND ANOTHER MESSAGE
    // ==============================
    if (sendAnotherBtn) {
        sendAnotherBtn.addEventListener('click', resetForm);
    }

    // ==============================
    // 7. KEYBOARD NAVIGATION
    // ==============================

    // Allow Escape to clear current field
    form.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeElement = document.activeElement;
            if (activeElement && activeElement.classList.contains('form-input')) {
                activeElement.value = '';
                activeElement.dispatchEvent(new Event('input'));
            }
        }
    });

    // Submit on Ctrl+Enter from textarea
    if (messageInput) {
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                form.dispatchEvent(new Event('submit'));
            }
        });
    }
});
