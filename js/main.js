/**
 * Portfolio - Responsive Animations System
 * -----------------------------------------
 * Rules:
 * - No heavy animations on mobile
 * - Respects prefers-reduced-motion
 * - Touch-friendly interactions
 * - No hover-only UX on mobile
 * - Uses IntersectionObserver for scroll reveals
 */

(function () {
    'use strict';

    // Ensure page starts at top on refresh
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // ============================================
    // ANIMATION CONFIGURATION
    // ============================================

    const AnimationConfig = {
        // Check if user prefers reduced motion
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,

        // Check if device is touch/mobile
        isMobile: window.matchMedia('(max-width: 768px)').matches,
        isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,

        // Animation durations (reduced on mobile)
        get duration() {
            if (this.prefersReducedMotion) return { fast: 0, normal: 0, slow: 0 };
            if (this.isMobile) return { fast: 150, normal: 250, slow: 400 };
            return { fast: 200, normal: 400, slow: 600 };
        },

        // Typing effect speed (slower/disabled on mobile for performance)
        get typingSpeed() {
            if (this.prefersReducedMotion) return { type: 0, delete: 0, pause: 1000, nextWord: 500 };
            if (this.isMobile) return { type: 150, delete: 75, pause: 2500, nextWord: 750 };
            return { type: 100, delete: 50, pause: 2000, nextWord: 500 };
        },

        // Scroll reveal thresholds
        get observerOptions() {
            return {
                threshold: this.isMobile ? 0.05 : 0.1,
                rootMargin: this.isMobile ? '0px 0px -30px 0px' : '0px 0px -50px 0px'
            };
        },

        // Update on resize
        update() {
            this.isMobile = window.matchMedia('(max-width: 768px)').matches;
            this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        }
    };

    // Listen for preference changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => {
        AnimationConfig.update();
    });

    // Debounced resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => AnimationConfig.update(), 250);
    });

    // ============================================
    // PRELOADER
    // ============================================

    function initPreloader() {
        const preloader = document.getElementById('preloader');
        if (!preloader) return;

        const hidePreloader = () => {
            const delay = AnimationConfig.prefersReducedMotion ? 0 : 800;
            setTimeout(() => {
                preloader.classList.add('fade-out');
                document.body.style.overflow = 'auto';
            }, delay);
        };

        if (document.readyState === 'complete') {
            hidePreloader();
        } else {
            window.addEventListener('load', hidePreloader);
        }
    }

    // ============================================
    // ENTRANCE ANIMATIONS
    // ============================================

    function initEntranceAnimations() {
        const elements = document.querySelectorAll('.animate-on-load');
        if (!elements.length) return;

        // If reduced motion, show immediately
        if (AnimationConfig.prefersReducedMotion) {
            elements.forEach(el => el.classList.add('fade-in-up'));
            return;
        }

        // Staggered entrance - lighter on mobile
        const baseDelay = AnimationConfig.isMobile ? 500 : 1000;
        const stagger = AnimationConfig.isMobile ? 100 : 200;

        elements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('fade-in-up');
            }, baseDelay + (index * stagger));
        });
    }

    // ============================================
    // TYPING EFFECT (Mobile-Optimized)
    // ============================================

    function initTypingEffect() {
        const typingElement = document.querySelector('.typing-text');
        if (!typingElement) return;

        const roles = [
            "Computer Science Student",
            "Web Developer",
            "Cybersecurity & Data Enthusiast"
        ];

        // If reduced motion, just cycle through roles statically
        if (AnimationConfig.prefersReducedMotion) {
            let roleIndex = 0;
            typingElement.textContent = roles[roleIndex];
            setInterval(() => {
                roleIndex = (roleIndex + 1) % roles.length;
                typingElement.textContent = roles[roleIndex];
            }, 3000);
            return;
        }

        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentRole = roles[roleIndex];
            const speed = AnimationConfig.typingSpeed;

            if (isDeleting) {
                typingElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }

            let delay;
            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                delay = speed.pause;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                delay = speed.nextWord;
            } else {
                delay = isDeleting ? speed.delete : speed.type;
            }

            setTimeout(type, delay);
        }

        // Start after entrance animations
        setTimeout(type, AnimationConfig.isMobile ? 1000 : 1500);
    }

    // ============================================
    // SCROLL REVEAL OBSERVER (IntersectionObserver)
    // ============================================

    function initScrollReveals() {
        const revealSelectors = [
            '.reveal-on-scroll',
            '.slide-in-left',
            '.slide-in-right',
            '.fade-up',
            '.scale-in',
            '.stagger-item'
        ];

        const revealElements = document.querySelectorAll(revealSelectors.join(', '));
        if (!revealElements.length) return;

        // If reduced motion, show all immediately
        if (AnimationConfig.prefersReducedMotion) {
            revealElements.forEach(el => {
                el.classList.add('in-view');
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add stagger delay for grouped items
                    const staggerIndex = entry.target.dataset.staggerIndex;
                    if (staggerIndex) {
                        const delay = AnimationConfig.isMobile ? 50 : 100;
                        setTimeout(() => {
                            entry.target.classList.add('in-view');
                        }, parseInt(staggerIndex) * delay);
                    } else {
                        entry.target.classList.add('in-view');
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, AnimationConfig.observerOptions);

        revealElements.forEach(el => observer.observe(el));
    }

    // ============================================
    // EXPERIENCE TIMELINE REVEALS
    // ============================================

    function initTimelineReveals() {
        const timelineItems = document.querySelectorAll('.exp-timeline-item');
        if (!timelineItems.length) return;

        if (AnimationConfig.prefersReducedMotion) {
            timelineItems.forEach(el => el.classList.add('revealed'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Lighter animation on mobile - just fade in without slide
                    if (AnimationConfig.isMobile) {
                        entry.target.style.animationDuration = '0.3s';
                    }
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: AnimationConfig.isMobile ? 0.1 : 0.2,
            rootMargin: '0px 0px -30px 0px'
        });

        timelineItems.forEach(el => observer.observe(el));
    }

    // ============================================
    // TOUCH-FRIENDLY INTERACTIONS
    // ============================================

    function initTouchInteractions() {
        // Add touch-active class for mobile tap feedback
        if (!AnimationConfig.isTouchDevice) return;

        document.body.classList.add('touch-device');

        // Enhanced touch feedback for interactive elements
        const interactiveSelectors = [
            '.btn',
            '.nav-link',
            '.project-card',
            '.skill-card',
            '.cert-card',
            '.contact-method'
        ];

        const interactiveElements = document.querySelectorAll(interactiveSelectors.join(', '));

        interactiveElements.forEach(el => {
            el.addEventListener('touchstart', function () {
                this.classList.add('touch-active');
            }, { passive: true });

            el.addEventListener('touchend', function () {
                // Small delay for visual feedback
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, 100);
            }, { passive: true });

            el.addEventListener('touchcancel', function () {
                this.classList.remove('touch-active');
            }, { passive: true });
        });
    }

    // ============================================
    // CERTIFICATE MODAL
    // ============================================

    function initCertificateModal() {
        const modal = document.querySelector('.modal-overlay');
        const modalImg = document.querySelector('.modal-img');
        const closeBtn = document.querySelector('.modal-close');
        const certCards = document.querySelectorAll('.cert-card');

        if (!modal || !modalImg) return;

        // Open Modal - Works for both click and touch
        certCards.forEach(card => {
            card.addEventListener('click', () => {
                const imgSrc = card.getAttribute('data-cert');
                if (imgSrc) {
                    modalImg.src = imgSrc;
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';

                    // Focus trap for accessibility
                    closeBtn?.focus();
                }
            });
        });

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            const duration = AnimationConfig.prefersReducedMotion ? 0 : 300;
            setTimeout(() => {
                modalImg.src = '';
            }, duration);
        };

        closeBtn?.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
        });

        // Touch gesture to close on mobile (swipe down)
        if (AnimationConfig.isTouchDevice) {
            let touchStartY = 0;
            modal.addEventListener('touchstart', (e) => {
                touchStartY = e.touches[0].clientY;
            }, { passive: true });

            modal.addEventListener('touchend', (e) => {
                const touchEndY = e.changedTouches[0].clientY;
                const diff = touchEndY - touchStartY;
                // If swiped down more than 100px, close
                if (diff > 100) closeModal();
            }, { passive: true });
        }
    }

    // ============================================
    // CONTACT FORM (Basic - main validation in contact.js)
    // ============================================

    function initContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) return;

        // Simple form handling - main logic in contact.js
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('name') || document.getElementById('contact-name');
            const emailInput = document.getElementById('email') || document.getElementById('contact-email');
            const messageInput = document.getElementById('message') || document.getElementById('contact-message');

            let isValid = true;

            const setError = (input, message) => {
                const formGroup = input.closest('.form-group');
                const errorDisplay = formGroup?.querySelector('.error-message, .form-error');
                if (formGroup) formGroup.classList.add('error');
                if (errorDisplay) errorDisplay.textContent = message;
                isValid = false;
            };

            const setSuccess = (input) => {
                const formGroup = input.closest('.form-group');
                if (formGroup) {
                    formGroup.classList.remove('error');
                    formGroup.classList.add('success');
                }
            };

            const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            // Validate
            if (nameInput && nameInput.value.trim() === '') {
                setError(nameInput, 'Name is required');
            } else if (nameInput) {
                setSuccess(nameInput);
            }

            if (emailInput && emailInput.value.trim() === '') {
                setError(emailInput, 'Email is required');
            } else if (emailInput && !isValidEmail(emailInput.value)) {
                setError(emailInput, 'Please enter a valid email');
            } else if (emailInput) {
                setSuccess(emailInput);
            }

            if (messageInput && messageInput.value.trim() === '') {
                setError(messageInput, 'Message cannot be empty');
            } else if (messageInput) {
                setSuccess(messageInput);
            }

            if (isValid) {
                const submitBtn = contactForm.querySelector('.submit-btn, .form-submit');
                if (submitBtn) {
                    const originalContent = submitBtn.innerHTML;
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<span>Sending...</span>';

                    setTimeout(() => {
                        alert('Thank you! Your message has been sent successfully.');
                        contactForm.reset();
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalContent;
                    }, 1500);
                }
            }
        });
    }

    // ============================================
    // ACTIVE NAVIGATION STATE
    // ============================================

    function initActiveNavigation() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('nav a');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.remove('active');

            if (currentPath.endsWith(href) ||
                (href === 'index.html' && (currentPath === '/' || currentPath.endsWith('/')))) {
                link.classList.add('active');
            }
        });
    }

    // ============================================
    // GITHUB STATS INTEGRATION
    // ============================================

    async function initGitHubStats() {
        const githubUser = 'Aryan20051';
        const repoEl = document.getElementById('github-repos');
        const starEl = document.getElementById('github-stars');
        const commitEl = document.getElementById('github-commits');

        if (!repoEl) return;

        try {
            // Fetch User info
            const userResponse = await fetch(`https://api.github.com/users/${githubUser}`);
            const userData = await userResponse.json();

            if (userData.public_repos !== undefined) {
                repoEl.innerHTML = userData.public_repos;
            }

            // Fetch Repos for stars calculation
            const reposResponse = await fetch(`https://api.github.com/users/${githubUser}/repos?per_page=100`);
            const reposData = await reposResponse.json();

            if (Array.isArray(reposData)) {
                const totalStars = reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0);
                starEl.innerHTML = totalStars;
            }

            // Commits placeholder
            commitEl.innerHTML = '250+';

        } catch (error) {
            console.error('GitHub fetch failed:', error);
            repoEl.innerHTML = '10+';
            starEl.innerHTML = '5+';
            commitEl.innerHTML = '200+';
        }
    }

    // ============================================
    // EASTER EGGS
    // ============================================

    function initEasterEggs() {
        let keys = [];
        const combo = 'coffee';
        const matrixCombo = 'matrix';

        window.addEventListener('keydown', (e) => {
            keys.push(e.key.toLowerCase());
            keys = keys.slice(-10); // Keep last 10 keys

            if (keys.join('').includes(combo)) {
                alert('☕ Powering up with coffee! Have a great day!');
                keys = [];
            }

            if (keys.join('').includes(matrixCombo)) {
                document.body.classList.toggle('matrix-mode');
                keys = [];
            }
        });
    }

    // ============================================
    // PARALLAX EFFECTS (Desktop only)
    // ============================================

    function initParallax() {
        // Skip on mobile and when reduced motion is preferred
        if (AnimationConfig.isMobile || AnimationConfig.prefersReducedMotion) return;

        const parallaxElements = document.querySelectorAll('[data-parallax]');
        if (!parallaxElements.length) return;

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    parallaxElements.forEach(el => {
                        const speed = parseFloat(el.dataset.parallax) || 0.5;
                        const offset = scrollY * speed;
                        el.style.transform = `translateY(${offset}px)`;
                    });
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ============================================
    // HOVER EFFECTS (Non-touch only)
    // ============================================

    function initHoverEffects() {
        // Skip on touch devices - they use touch-active instead
        if (AnimationConfig.isTouchDevice) return;

        // Add hover-enabled class for CSS targeting
        document.body.classList.add('hover-enabled');
    }

    // ============================================
    // NAVBAR SPOTLIGHT EFFECT
    // ============================================

    function initNavbarSpotlight() {
        const navbar = document.querySelector('.navbar');
        if (!navbar || AnimationConfig.isTouchDevice) return;

        navbar.addEventListener('mousemove', (e) => {
            const rect = navbar.getBoundingClientRect();
            // Calculate mouse position relative to navbar
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Update CSS variables
            navbar.style.setProperty('--mouse-x', `${x}px`);
            navbar.style.setProperty('--mouse-y', `${y}px`);
        }, { passive: true });

        // Optional: Reset/Fade out on leave handled by CSS opacity
    }

    // ============================================
    // CUSTOM CURSOR LOGIC
    // ============================================

    function initCustomCursor() {
        if (AnimationConfig.isTouchDevice || AnimationConfig.isMobile) return;

        const cursor = document.querySelector('.custom-cursor');
        const cursorOutline = document.querySelector('.custom-cursor-outline');

        if (!cursor || !cursorOutline) return;

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let outlineX = 0, outlineY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }, { passive: true });

        // Smooth cursor movement
        function animateCursor() {
            // Inner dot
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;

            // Outer ring (slower for magnetic effect)
            outlineX += (mouseX - outlineX) * 0.1;
            outlineY += (mouseY - outlineY) * 0.1;
            cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0)`;

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover effects
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-card, .cert-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    // ============================================
    // THEME TOGGLE LOGIC
    // ============================================

    function initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        const currentTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', currentTheme);

        themeToggle.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            // Subtle feedback animation logic can be added here if needed
        });
    }

    // ============================================
    // SCROLL ENHANCEMENTS
    // ============================================

    function initScrollEnhancements() {
        const progressBar = document.getElementById('scroll-progress-bar');
        const backToTopBtn = document.getElementById('back-to-top');

        if (!progressBar && !backToTopBtn) return;

        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;

            if (progressBar) {
                progressBar.style.width = scrolled + "%";
            }

            if (backToTopBtn) {
                if (winScroll > 300) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            }
        }, { passive: true });

        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // ============================================
    // INTERACTIVE GLASS TILT EFFECT
    // ============================================

    function initGlassTiltEffect() {
        if (AnimationConfig.isTouchDevice) return;

        const cards = document.querySelectorAll('.skill-card, .project-card, .cert-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            });
        });
    }

    // ============================================
    // INITIALIZE ALL
    // ============================================

    function init() {
        initPreloader();
        initEntranceAnimations();
        initTypingEffect();
        initScrollReveals();
        initTimelineReveals();
        initTouchInteractions();
        initCertificateModal();
        initContactForm();
        initActiveNavigation();
        initParallax();
        initHoverEffects();
        initNavbarSpotlight();
        initCustomCursor();
        initThemeToggle();
        initGitHubStats();
        initEasterEggs();
        initScrollEnhancements();
        initGlassTiltEffect();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
