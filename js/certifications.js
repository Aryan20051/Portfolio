// Certifications Page - Modal & Lazy Loading

document.addEventListener('DOMContentLoaded', () => {
    // ==============================
    // 1. CERTIFICATE MODAL
    // ==============================
    const modal = document.getElementById('cert-modal');
    const modalImg = modal?.querySelector('.cert-modal-img');
    const modalLoader = modal?.querySelector('.cert-modal-loader');
    const modalClose = modal?.querySelector('.cert-modal-close');
    const modalBackdrop = modal?.querySelector('.cert-modal-backdrop');
    const modalContent = modal?.querySelector('.cert-modal-content');
    const modalZoom = modal?.querySelector('.cert-modal-zoom');
    const certCards = document.querySelectorAll('.cert-card');

    if (!modal || !modalImg) return;

    // Open modal function
    function openModal(imageSrc) {
        if (!imageSrc) return;

        // Show loader, hide image
        modalLoader?.classList.remove('hidden');
        modalImg.style.opacity = '0';
        modalImg.src = '';

        // Open modal
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Load image with lazy loading
        modalImg.src = imageSrc;

        // Focus on close button for accessibility
        setTimeout(() => modalClose?.focus(), 100);
    }

    // Close modal function
    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        // Reset zoom state
        modalContent?.classList.remove('zoomed');

        // Clear image after animation
        setTimeout(() => {
            modalImg.src = '';
            modalImg.style.opacity = '0';
            modalLoader?.classList.remove('hidden');
        }, 300);
    }

    // Image load handler
    modalImg.addEventListener('load', () => {
        modalLoader?.classList.add('hidden');
        modalImg.style.opacity = '1';
    });

    // Image error handler
    modalImg.addEventListener('error', () => {
        modalLoader?.classList.add('hidden');
        modalImg.alt = 'Failed to load certificate';
    });

    // ==============================
    // 2. EVENT LISTENERS
    // ==============================

    // Click on certificate card
    certCards.forEach(card => {
        // Click anywhere on card opens modal
        card.addEventListener('click', (e) => {
            const imageSrc = card.dataset.cert;
            if (imageSrc) {
                openModal(imageSrc);
            }
        });

        // View button click (prevent double trigger)
        const viewBtn = card.querySelector('.cert-view-btn');
        if (viewBtn) {
            viewBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click from also firing
                const imageSrc = card.dataset.cert;
                if (imageSrc) {
                    openModal(imageSrc);
                }
            });
        }

        // Keyboard accessibility
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const imageSrc = card.dataset.cert;
                if (imageSrc) {
                    openModal(imageSrc);
                }
            }
        });
    });

    // Close modal events
    modalClose?.addEventListener('click', closeModal);
    modalBackdrop?.addEventListener('click', closeModal);

    // Keyboard: Escape to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // ==============================
    // 3. ZOOM FUNCTIONALITY
    // ==============================

    let isZoomed = false;

    modalZoom?.addEventListener('click', () => {
        isZoomed = !isZoomed;

        if (isZoomed) {
            modalContent?.classList.add('zoomed');
            // Update zoom icon to minus
            modalZoom.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    <line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
            `;
        } else {
            modalContent?.classList.remove('zoomed');
            // Update zoom icon to plus
            modalZoom.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    <line x1="11" y1="8" x2="11" y2="14"/>
                    <line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
            `;
        }
    });

    // Double-click to toggle zoom (desktop)
    modalImg.addEventListener('dblclick', () => {
        modalZoom?.click();
    });

    // ==============================
    // 4. TOUCH/DRAG SUPPORT FOR ZOOMED IMAGE
    // ==============================

    let isDragging = false;
    let startX, startY, scrollLeft, scrollTop;

    modalContent?.addEventListener('mousedown', (e) => {
        if (!modalContent.classList.contains('zoomed')) return;

        isDragging = true;
        startX = e.pageX - modalContent.offsetLeft;
        startY = e.pageY - modalContent.offsetTop;
        scrollLeft = modalContent.scrollLeft;
        scrollTop = modalContent.scrollTop;
    });

    modalContent?.addEventListener('mouseleave', () => {
        isDragging = false;
    });

    modalContent?.addEventListener('mouseup', () => {
        isDragging = false;
    });

    modalContent?.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();

        const x = e.pageX - modalContent.offsetLeft;
        const y = e.pageY - modalContent.offsetTop;
        const walkX = (x - startX) * 1.5;
        const walkY = (y - startY) * 1.5;

        modalContent.scrollLeft = scrollLeft - walkX;
        modalContent.scrollTop = scrollTop - walkY;
    });

    // Touch support for mobile
    let touchStartX, touchStartY;

    modalContent?.addEventListener('touchstart', (e) => {
        if (!modalContent.classList.contains('zoomed')) return;

        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        scrollLeft = modalContent.scrollLeft;
        scrollTop = modalContent.scrollTop;
    }, { passive: true });

    modalContent?.addEventListener('touchmove', (e) => {
        if (!modalContent.classList.contains('zoomed')) return;

        const deltaX = touchStartX - e.touches[0].clientX;
        const deltaY = touchStartY - e.touches[0].clientY;

        modalContent.scrollLeft = scrollLeft + deltaX;
        modalContent.scrollTop = scrollTop + deltaY;
    }, { passive: true });

    // ==============================
    // 5. LAZY LOADING FOR THUMBNAILS (future enhancement)
    // ==============================

    // If you add thumbnail images to cards in the future,
    // they will automatically lazy load via the browser's
    // native loading="lazy" attribute
});
