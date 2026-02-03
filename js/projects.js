// Projects Page - Filter & Modal Functionality

document.addEventListener('DOMContentLoaded', () => {
    // ==============================
    // 1. PROJECT FILTERING
    // ==============================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length && projectCards.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;

                // Filter cards
                projectCards.forEach(card => {
                    const category = card.dataset.category;

                    if (filter === 'all' || category === filter) {
                        card.classList.remove('hidden');
                        card.style.animation = 'fadeIn 0.4s ease forwards';
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }

    // ==============================
    // 2. PROJECT MODAL
    // ==============================
    const modal = document.getElementById('project-modal');
    const modalClose = modal?.querySelector('.project-modal-close');
    const modalBackdrop = modal?.querySelector('.project-modal-backdrop');

    // Project data for modal
    const projectsData = {
        'property-shodh': {
            emoji: '🏠',
            tags: ['Web', 'Frontend'],
            title: 'Property Shodh',
            description: 'A responsive single-page real estate website built as part of an internship assignment. Features modern UI with smooth animations, a curated property catalog, and performance-optimized design with LCP under 1 second.',
            features: [
                'Responsive mobile-first design',
                'Modern property catalog with filters',
                'Smooth scroll animations',
                'Performance optimized (LCP < 1s)',
                'Clean, professional UI'
            ],
            tech: ['HTML5', 'CSS3', 'JavaScript'],
            demo: 'https://aryan20051.github.io/property-shodh-website-assignment/',
            code: 'https://github.com/Aryan20051/property-shodh-website-assignment'
        },
        'virtual-office': {
            emoji: '🖥️',
            tags: ['Full-Stack', 'Collaboration'],
            title: 'Virtual Office',
            description: 'A virtual workspace application enabling remote team collaboration with real-time features. Built with modern JavaScript and TypeScript for type safety and maintainability.',
            features: [
                'Real-time collaboration features',
                'Virtual workspace environment',
                'Team communication tools',
                'Modern TypeScript codebase',
                'Responsive interface design'
            ],
            tech: ['JavaScript', 'TypeScript', 'CSS', 'HTML'],
            demo: null,
            code: 'https://github.com/Aryan20051/Virtual-Office'
        }
    };

    // Populate and open modal
    function openModal(projectId) {
        const project = projectsData[projectId];
        if (!project || !modal) return;

        // Populate modal content
        const modalEmoji = modal.querySelector('.project-modal-emoji');
        const modalTags = modal.querySelector('.project-modal-tags');
        const modalTitle = modal.querySelector('.project-modal-title');
        const modalDesc = modal.querySelector('.project-modal-desc');
        const modalFeatures = modal.querySelector('.project-modal-features');
        const modalTech = modal.querySelector('.project-modal-tech');
        const modalActions = modal.querySelector('.project-modal-actions');

        if (modalEmoji) modalEmoji.textContent = project.emoji;
        if (modalTitle) modalTitle.textContent = project.title;
        if (modalDesc) modalDesc.textContent = project.description;

        // Tags
        if (modalTags) {
            modalTags.innerHTML = project.tags
                .map(tag => `<span class="project-tag">${tag}</span>`)
                .join('');
        }

        // Features
        if (modalFeatures) {
            modalFeatures.innerHTML = project.features
                .map(feature => `<li>${feature}</li>`)
                .join('');
        }

        // Tech stack
        if (modalTech) {
            modalTech.innerHTML = project.tech
                .map(tech => `<span>${tech}</span>`)
                .join('');
        }

        // Actions
        if (modalActions) {
            let actionsHTML = '';
            if (project.demo) {
                actionsHTML += `
                    <a href="${project.demo}" class="btn btn-primary" target="_blank" rel="noopener">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                        Live Demo
                    </a>
                `;
            }
            if (project.code) {
                actionsHTML += `
                    <a href="${project.code}" class="btn btn-secondary" target="_blank" rel="noopener">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                        </svg>
                        View Code
                    </a>
                `;
            }
            modalActions.innerHTML = actionsHTML;
        }

        // Show modal
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Focus trap - focus on close button
        if (modalClose) {
            setTimeout(() => modalClose.focus(), 100);
        }
    }

    // Close modal
    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Event listeners for opening modal
    projectCards.forEach(card => {
        // For desktop: click on overlay button
        const detailsBtn = card.querySelector('.project-details-btn');
        const overlayBtn = card.querySelector('.project-overlay .btn');

        const openHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const projectId = card.dataset.project;
            if (projectId) openModal(projectId);
        };

        if (detailsBtn) {
            detailsBtn.addEventListener('click', openHandler);
        }

        if (overlayBtn) {
            overlayBtn.addEventListener('click', openHandler);
        }

        // For touch devices: double-tap or long-press to open modal
        // Single tap shows subtle feedback (handled by CSS :active)
    });

    // Event listeners for closing modal
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeModal);
    }

    // Keyboard handling
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('active')) {
            closeModal();
        }
    });

    // ==============================
    // 3. ANIMATIONS
    // ==============================
    // Add fade-in animation keyframes if not exists
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(styleSheet);
});
