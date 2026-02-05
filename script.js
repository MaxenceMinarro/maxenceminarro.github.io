// ========================================
// PRELOADER
// ========================================
const preloader = document.querySelector('.preloader');

if (preloader) {
    // Lock body scroll during loading
    document.body.classList.add('loading');

    // Hide preloader after animation completes
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('loaded');
            document.body.classList.remove('loading');
        }, 1800); // Wait for progress bar animation (1.5s) + small buffer
    });
}

// ========================================
// CUSTOM CURSOR
// ========================================
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

if (cursorDot && cursorRing) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    // Smooth ring follow
    function animateCursor() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .project-card, .skills-category, .contact-link');

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorRing.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursorRing.classList.remove('hover');
        });
    });
}

// ========================================
// MOBILE NAVIGATION
// ========================================
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ========================================
// SMOOTH SCROLL
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// SCROLL ANIMATIONS
// ========================================
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

// Animate elements on scroll
const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Add fade-in class to elements
document.querySelectorAll('.section-header, .project-card, .skills-category, .contact-info, .contact-form').forEach(el => {
    el.classList.add('fade-in');
    animateOnScroll.observe(el);
});

// ========================================
// SKILL BARS ANIMATION
// ========================================
const skillCategories = document.querySelectorAll('.skills-category');

if (skillCategories.length > 0) {
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll('.skill-progress');
                progressBars.forEach((bar, index) => {
                    const progress = bar.getAttribute('data-progress');
                    setTimeout(() => {
                        bar.style.width = progress + '%';
                    }, 100 + (index * 100));
                });
                // Unobserve après animation pour éviter répétition
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    skillCategories.forEach(category => {
        skillObserver.observe(category);
    });
}

// ========================================
// NAVBAR HIDE/SHOW ON SCROLL
// ========================================
const nav = document.querySelector('.nav');

if (nav) {
    let lastScrollY = window.scrollY;
    let navTicking = false;

    window.addEventListener('scroll', () => {
        if (navTicking) return;
        navTicking = true;

        requestAnimationFrame(() => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                nav.classList.add('nav-hidden');
            } else {
                nav.classList.remove('nav-hidden');
            }

            if (currentScrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }

            lastScrollY = currentScrollY;
            navTicking = false;
        });
    });
}

// ========================================
// CONTACT FORM HANDLING
// ========================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    // Validation d'un champ individuel
    function validateField(input) {
        const value = input.value.trim();
        let error = '';

        if (!value) {
            error = 'Ce champ est requis';
        } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            error = 'Adresse email invalide';
        } else if (input.name === 'name' && value.length < 2) {
            error = 'Le nom doit contenir au moins 2 caractères';
        } else if (input.name === 'message' && value.length < 10) {
            error = 'Le message doit contenir au moins 10 caractères';
        }

        // Affichage ou suppression du message d'erreur
        let errorEl = input.parentElement.querySelector('.form-error');
        if (error) {
            if (!errorEl) {
                errorEl = document.createElement('span');
                errorEl.className = 'form-error';
                input.parentElement.appendChild(errorEl);
            }
            errorEl.textContent = error;
            input.classList.add('input-error');
            return false;
        } else {
            if (errorEl) errorEl.remove();
            input.classList.remove('input-error');
            return true;
        }
    }

    // Validation en temps réel au blur
    contactForm.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('input-error')) validateField(input);
        });
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Valider tous les champs
        const inputs = contactForm.querySelectorAll('input:not([type="hidden"]), textarea');
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) isValid = false;
        });

        if (!isValid) return;

        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;

        // État de chargement
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Envoi en cours...</span>';

        // Envoi réel via Formspree
        const formData = new FormData(contactForm);

        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        })
        .then(response => {
            if (response.ok) {
                submitBtn.innerHTML = '<span>Message envoyé !</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                submitBtn.style.background = '#27ae60';
                contactForm.reset();
            } else {
                throw new Error('Erreur serveur');
            }
        })
        .catch(() => {
            submitBtn.innerHTML = '<span>Erreur, réessayez</span>';
            submitBtn.style.background = '#e74c3c';
        })
        .finally(() => {
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        });
    });
}

// ========================================
// PARALLAX EFFECT ON FLOATING ELEMENTS
// ========================================
const floatingElements = document.querySelectorAll('.float-circle, .float-arch');

if (floatingElements.length > 0 && window.matchMedia('(min-width: 769px)').matches) {
    let parallaxTicking = false;

    window.addEventListener('mousemove', (e) => {
        if (parallaxTicking) return;
        parallaxTicking = true;

        requestAnimationFrame(() => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;

            floatingElements.forEach((el, index) => {
                const speed = (index + 1) * 15;
                const xOffset = (x - 0.5) * speed;
                const yOffset = (y - 0.5) * speed;

                el.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
            });
            parallaxTicking = false;
        });
    });
}

// ========================================
// ACTIVE NAV LINK ON SCROLL
// ========================================
const sections = document.querySelectorAll('section[id]');

if (sections.length > 0 && navLinks) {
    let activeNavTicking = false;

    window.addEventListener('scroll', () => {
        if (activeNavTicking) return;
        activeNavTicking = true;

        requestAnimationFrame(() => {
            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop;

                if (window.scrollY >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.querySelectorAll('a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
            activeNavTicking = false;
        });
    });
}

// ========================================
// COPY EMAIL BUTTON
// ========================================
const copyBtn = document.querySelector('.copy-email-btn');

if (copyBtn) {
    const copyIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" stroke-width="1.5"/></svg>';
    const checkIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    function showCopied() {
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = checkIcon;
        setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = copyIcon;
        }, 2000);
    }

    copyBtn.addEventListener('click', () => {
        const email = copyBtn.getAttribute('data-email');

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(email).then(showCopied).catch(() => {
                // Fallback pour HTTP ou erreur clipboard
                fallbackCopy(email);
            });
        } else {
            fallbackCopy(email);
        }
    });

    function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showCopied();
        } catch (e) {
            // Dernier recours : alerter l'utilisateur
            prompt('Copiez ce mail :', text);
        }
        document.body.removeChild(textarea);
    }
}

// ========================================
// PAGE LOAD ANIMATION
// ========================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Stagger animation for hero elements
    const heroElements = document.querySelectorAll('.hero-tag, .hero-title, .hero-description, .hero-cta');
    heroElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.15}s`;
    });
});

// ========================================
// PROJECT CARDS SUBTLE HOVER EFFECT
// ========================================
const projectCards = document.querySelectorAll('.project-card:not(.flip-card):not(.flip-card-small)');

projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 30;
        const rotateY = (centerX - x) / 30;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});