/**
 * Navigation Module
 * Handles: Mobile hamburger menu, active states, smooth scroll
 */

(function () {
    'use strict';

    // DOM Elements
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;

    /**
     * Toggle mobile menu
     */
    function toggleMenu() {
        body.classList.toggle('nav-open');

        // Update aria-expanded for accessibility
        const isOpen = body.classList.contains('nav-open');
        if (navToggle) {
            navToggle.setAttribute('aria-expanded', isOpen);
        }
    }

    /**
     * Close mobile menu
     */
    function closeMenu() {
        body.classList.remove('nav-open');
        if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'false');
        }
    }

    /**
     * Set active navigation link based on current URL
     */
    function setActiveNavLink() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const linkPage = href.split('/').pop();

            link.classList.remove('active');

            // Match current page or root to index
            if (linkPage === currentPage ||
                (currentPage === '' && linkPage === 'index.html') ||
                (currentPath === '/' && linkPage === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Handle keyboard navigation
     */
    function handleKeydown(e) {
        // Close menu on Escape
        if (e.key === 'Escape' && body.classList.contains('nav-open')) {
            closeMenu();
            navToggle?.focus();
        }
    }

    /**
     * Handle click outside menu to close
     */
    function handleClickOutside(e) {
        if (body.classList.contains('nav-open')) {
            // Check if click is outside nav menu and toggle
            if (!navMenu?.contains(e.target) &&
                !navToggle?.contains(e.target)) {
                closeMenu();
            }
        }
    }

    /**
     * Initialize navigation
     */
    function init() {
        // Set initial active state
        setActiveNavLink();

        // Hamburger toggle click
        if (navToggle) {
            navToggle.addEventListener('click', toggleMenu);
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-controls', 'nav-menu');
        }

        // Close menu when clicking a nav link (on mobile)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Small delay to allow the click to register
                setTimeout(closeMenu, 100);
            });
        });

        // Keyboard accessibility
        document.addEventListener('keydown', handleKeydown);

        // Click outside to close (optional)
        // document.addEventListener('click', handleClickOutside);

        // Handle resize - close menu if switching to desktop
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth >= 768) {
                    closeMenu();
                }
            }, 100);
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
