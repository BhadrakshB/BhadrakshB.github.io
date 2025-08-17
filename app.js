/**
 * State-of-the-art Portfolio JavaScript
 * Production-grade animations and interactions
 */

class ModernPortfolio {
    constructor() {
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.isMobile = window.innerWidth < 1024;
        this.currentSection = 'hero';
        this.sections = ['hero', 'about', 'skills', 'experience', 'projects', 'leadership', 'contact'];
        this.scrollProgress = 0;
        this.isScrolling = false;
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        // Register GSAP plugins
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
        
        // Set defaults for better performance
        gsap.defaults({
            duration: 0.8,
            ease: "power2.out"
        });

        // Initialize all components
        this.initCursorFollower();
        this.initNavigation();
        this.initScrollBeacon();
        this.initScrollAnimations();
        this.initMagneticButtons();
        // this.initFormHandling();
        this.initSmoothScrolling();
        this.initPerformanceOptimizations();

        // Handle resize with throttling
        this.handleResize = this.throttle(() => {
            this.isMobile = window.innerWidth < 1024;
            ScrollTrigger.refresh();
        }, 250);
        
        window.addEventListener('resize', this.handleResize);

        // Initialize animations after a brief delay for better performance
        requestAnimationFrame(() => {
            this.initHeroAnimations();
            this.initSectionAnimations();
        });

        console.log('🚀 Modern Portfolio initialized');
    }

    /**
     * Cursor Follower - Desktop only
     */
    initCursorFollower() {
        if (this.isMobile || this.isReducedMotion) return;

        const cursor = document.getElementById('cursor-follower');
        if (!cursor) return;

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        // Update mouse position
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth cursor following
        const updateCursor = () => {
            const speed = 0.2;
            cursorX += (mouseX - cursorX) * speed;
            cursorY += (mouseY - cursorY) * speed;
            
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
            requestAnimationFrame(updateCursor);
        };
        
        updateCursor();

        // Interactive elements
        const interactiveElements = 'a, button, .magnetic, .project-card, .skill-chip';
        
        document.addEventListener('mouseenter', (e) => {
            if (e.target.matches(interactiveElements)) {
                gsap.to(cursor, { scale: 1.5, duration: 0.3 });
            }
        }, true);

        document.addEventListener('mouseleave', (e) => {
            if (e.target.matches(interactiveElements)) {
                gsap.to(cursor, { scale: 1, duration: 0.3 });
            }
        }, true);
    }

    /**
     * Navigation and Scroll Progress
     */
    initNavigation() {
        const navbar = document.getElementById('navbar');
        const progressLine = document.querySelector('.progress-line');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!navbar || !progressLine) return;

        // Auto-hide navbar on scroll (desktop only)
        if (!this.isMobile) {
            let lastScrollY = 0;
            let ticking = false;

            const updateNavbar = () => {
                const currentScrollY = window.scrollY;
                
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    // Scrolling down
                    gsap.to(navbar, { y: -100, duration: 0.3 });
                } else {
                    // Scrolling up
                    gsap.to(navbar, { y: 0, duration: 0.3 });
                }
                
                lastScrollY = currentScrollY;
                ticking = false;
            };

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(updateNavbar);
                    ticking = true;
                }
            });
        }

        // Scroll progress
        ScrollTrigger.create({
            start: 'top top',
            end: 'max',
            onUpdate: (self) => {
                this.scrollProgress = self.progress;
                progressLine.style.width = `${self.progress * 100}%`;
            }
        });

        // Active navigation link
        this.sections.forEach((sectionId) => {
            const section = document.getElementById(sectionId);
            if (section) {
                ScrollTrigger.create({
                    trigger: section,
                    start: 'top 20%',
                    end: 'bottom 20%',
                    onEnter: () => this.updateActiveSection(sectionId),
                    onEnterBack: () => this.updateActiveSection(sectionId)
                });
            }
        });

        // Navigation click handlers
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        });
    }

    /**
     * Scroll Beacon
     */
    initScrollBeacon() {
        const beacon = document.getElementById('scroll-beacon');
        const beaconLabel = document.getElementById('beacon-label');
        const ringProgress = document.querySelector('.ring-progress');

        if (!beacon || !beaconLabel || !ringProgress) return;

        // Update progress ring
        ScrollTrigger.create({
            start: 'top top',
            end: 'max',
            onUpdate: (self) => {
                const circumference = 283; // 2 * π * r (45)
                const offset = circumference - (self.progress * circumference);
                ringProgress.style.strokeDashoffset = offset;
            }
        });

        // Beacon click handler
        beacon.addEventListener('click', () => {
            const currentIndex = this.sections.indexOf(this.currentSection);
            const nextIndex = (currentIndex + 1) % this.sections.length;
            const nextSection = this.sections[nextIndex];
            this.scrollToSection(nextSection);
        });

        // Hover effects
        beacon.addEventListener('mouseenter', () => {
            if (!this.isReducedMotion) {
                gsap.to(beacon, { scale: 1.1, duration: 0.3 });
            }
        });

        beacon.addEventListener('mouseleave', () => {
            if (!this.isReducedMotion) {
                gsap.to(beacon, { scale: 1, duration: 0.3 });
            }
        });
    }

    /**
     * Update active section
     */
    updateActiveSection(sectionId) {
        this.currentSection = sectionId;
        
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href').substring(1);
            link.classList.toggle('active', href === sectionId);
        });

        // Update beacon label
        const beaconLabel = document.getElementById('beacon-label');
        if (beaconLabel) {
            const sectionNames = {
                'hero': 'Hero',
                'about': 'About',
                'skills': 'Skills',
                'experience': 'Experience', 
                'projects': 'Work',
                'leadership': 'Leadership',
                'contact': 'Contact'
            };
            beaconLabel.textContent = sectionNames[sectionId] || 'Section';
        }
    }

    /**
     * Hero Animations
     */
    initHeroAnimations() {
        const heroContent = document.querySelector('.hero-content');
        const heroBackground = document.querySelector('.hero-background');
        const scrollIndicator = document.querySelector('.scroll-indicator');

        if (!heroContent) return;

        // Hero content animation timeline
        const heroTl = gsap.timeline({ delay: 0.5 });

        // Animate hero elements in sequence
        heroTl
            .fromTo('.hero-badge', 
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" })
            .fromTo('.hero-title .title-main', 
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, 0.2)
            .fromTo('.hero-title .title-sub', 
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, 0.4)
            .fromTo('.hero-description', 
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, 0.6)
            .fromTo('.hero-metrics', 
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, 0.8)
            .fromTo('.hero-actions', 
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, 1);

        // Animate metric numbers
        document.querySelectorAll('.metric-number').forEach((metric, index) => {
            const targetValue = metric.textContent;
            const numericValue = parseInt(targetValue);
            
            if (!isNaN(numericValue)) {
                gsap.fromTo(metric, 
                    { textContent: 0 },
                    { 
                        textContent: numericValue,
                        duration: 2,
                        delay: 1.5 + (index * 0.2),
                        ease: "power2.out",
                        snap: { textContent: 1 },
                        onUpdate: function() {
                            metric.textContent = Math.round(this.targets()[0].textContent) + targetValue.replace(/\d+/g, '');
                        }
                    }
                );
            }
        });

        // Parallax background orbs
        if (heroBackground && !this.isReducedMotion) {
            const orbs = heroBackground.querySelectorAll('.gradient-orb');
            orbs.forEach((orb, index) => {
                const speed = 0.5 + (index * 0.2);
                gsap.to(orb, {
                    y: -100 * speed,
                    rotation: 360 * speed,
                    ease: "none",
                    scrollTrigger: {
                        trigger: ".hero",
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                });
            });
        }

        // Hide scroll indicator on scroll
        if (scrollIndicator) {
            gsap.to(scrollIndicator, {
                opacity: 0,
                y: 20,
                scrollTrigger: {
                    trigger: ".hero",
                    start: "center top",
                    end: "bottom top",
                    scrub: 1
                }
            });
        }
    }

    /**
     * Section Animations
     */
    initSectionAnimations() {
        // About section
        this.animateAboutSection();
        
        // Skills section
        this.animateSkillsSection();
        
        // Experience section
        this.animateExperienceSection();
        
        // Projects section
        this.animateProjectsSection();
        
        // Leadership section
        this.animateLeadershipSection();
        
        // Contact section
        this.animateContactSection();
    }

    animateAboutSection() {
        const aboutContent = document.querySelector('.about-content');
        const aboutVisual = document.querySelector('.about-visual');
        const profileCard = document.querySelector('.profile-card');

        if (aboutContent) {
            gsap.fromTo(aboutContent, 
                { x: -80, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 1,
                    scrollTrigger: {
                        trigger: aboutContent,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }

        if (aboutVisual) {
            gsap.fromTo(aboutVisual,
                { x: 80, opacity: 0, rotationY: 15 },
                {
                    x: 0,
                    opacity: 1,
                    rotationY: 0,
                    duration: 1,
                    delay: 0.2,
                    scrollTrigger: {
                        trigger: aboutVisual,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }

        // Profile card hover effect
        if (profileCard && !this.isReducedMotion) {
            profileCard.addEventListener('mouseenter', () => {
                gsap.to(profileCard, { y: -10, duration: 0.3 });
            });

            profileCard.addEventListener('mouseleave', () => {
                gsap.to(profileCard, { y: 0, duration: 0.3 });
            });
        }
    }

    animateSkillsSection() {
        const skillCategories = document.querySelectorAll('.skill-category');
        
        skillCategories.forEach((category, index) => {
            // Category reveal
            gsap.fromTo(category,
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    delay: index * 0.1,
                    scrollTrigger: {
                        trigger: category,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            // Skill chips stagger
            const skillChips = category.querySelectorAll('.skill-chip');
            gsap.fromTo(skillChips,
                { scale: 0.8, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.05,
                    delay: 0.3 + (index * 0.1),
                    ease: "back.out(1.7)",
                    scrollTrigger: {
                        trigger: category,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
    }

    animateExperienceSection() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach((item, index) => {
            const isEven = index % 2 === 0;
            
            gsap.fromTo(item,
                { x: isEven ? -50 : 50, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.8,
                    delay: index * 0.2,
                    scrollTrigger: {
                        trigger: item,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            // Animate timeline marker
            const marker = item.querySelector('.marker-dot');
            if (marker) {
                gsap.fromTo(marker,
                    { scale: 0 },
                    {
                        scale: 1,
                        duration: 0.4,
                        delay: 0.5 + (index * 0.2),
                        ease: "back.out(2)",
                        scrollTrigger: {
                            trigger: item,
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }
        });
    }

    animateProjectsSection() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach((card, index) => {
            // Card reveal
            gsap.fromTo(card,
                { y: 80, opacity: 0, rotationX: 10 },
                {
                    y: 0,
                    opacity: 1,
                    rotationX: 0,
                    duration: 0.8,
                    delay: index * 0.15,
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            // Hover effects
            if (!this.isReducedMotion) {
                card.addEventListener('mouseenter', () => {
                    gsap.to(card, { 
                        y: -12, 
                        rotationX: 5,
                        duration: 0.4,
                        ease: "power2.out"
                    });
                });

                card.addEventListener('mouseleave', () => {
                    gsap.to(card, { 
                        y: 0, 
                        rotationX: 0,
                        duration: 0.4,
                        ease: "power2.out"
                    });
                });
            }
        });
    }

    animateLeadershipSection() {
        const leadershipCards = document.querySelectorAll('.leadership-card');
        
        leadershipCards.forEach((card, index) => {
            gsap.fromTo(card,
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    delay: index * 0.2,
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            // Animate cert items
            const certItems = card.querySelectorAll('.cert-item');
            if (certItems.length) {
                gsap.fromTo(certItems,
                    { x: 30, opacity: 0 },
                    {
                        x: 0,
                        opacity: 1,
                        duration: 0.6,
                        stagger: 0.1,
                        delay: 0.5 + (index * 0.2),
                        scrollTrigger: {
                            trigger: card,
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }
        });
    }

    animateContactSection() {
        const contactInfo = document.querySelector('.contact-info');
        const contactForm = document.querySelector('.contact-form-container');
        
        if (contactInfo) {
            gsap.fromTo(contactInfo,
                { x: -60, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 1,
                    scrollTrigger: {
                        trigger: contactInfo,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }

        if (contactForm) {
            gsap.fromTo(contactForm,
                { x: 60, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 1,
                    delay: 0.2,
                    scrollTrigger: {
                        trigger: contactForm,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            // Animate form groups
            const formGroups = contactForm.querySelectorAll('.form-group');
            gsap.fromTo(formGroups,
                { y: 20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    delay: 0.5,
                    scrollTrigger: {
                        trigger: contactForm,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }
    }

    /**
     * Scroll-based animations
     */
    initScrollAnimations() {
        // Section titles
        gsap.utils.toArray('.section-title').forEach((title) => {
            gsap.fromTo(title,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    scrollTrigger: {
                        trigger: title,
                        start: "top 90%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Section badges
        gsap.utils.toArray('.section-badge').forEach((badge) => {
            gsap.fromTo(badge,
                { y: 20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    scrollTrigger: {
                        trigger: badge,
                        start: "top 95%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
    }

    /**
     * Magnetic Buttons
     */
    initMagneticButtons() {
        if (this.isMobile || this.isReducedMotion) return;

        const magneticElements = document.querySelectorAll('.magnetic');
        
        magneticElements.forEach((element) => {
            element.addEventListener('mouseenter', () => {
                gsap.to(element, { scale: 1.05, duration: 0.3 });
            });

            element.addEventListener('mouseleave', () => {
                gsap.to(element, { scale: 1, x: 0, y: 0, duration: 0.3 });
            });

            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                gsap.to(element, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
    }

    /**
     * Form Handling
     */
    // initFormHandling() {
    //     const form = document.getElementById('contactForm');
    //     if (!form) return;

    //     form.addEventListener('submit', (e) => {
    //         e.preventDefault();
    //         this.handleFormSubmit(form);
    //     });

    //     // Form field interactions
    //     const formControls = form.querySelectorAll('.form-control');
    //     formControls.forEach((control) => {
    //         control.addEventListener('focus', () => {
    //             if (!this.isReducedMotion) {
    //                 gsap.to(control, { y: -2, duration: 0.2 });
    //             }
    //         });

    //         control.addEventListener('blur', () => {
    //             if (!this.isReducedMotion) {
    //                 gsap.to(control, { y: 0, duration: 0.2 });
    //             }
    //         });
    //     });
    // }

    // handleFormSubmit(form) {
    //     const submitBtn = form.querySelector('button[type="submit"]');
    //     const btnText = submitBtn.querySelector('.btn-text');
    //     const originalText = btnText.textContent;

    //     // Disable form and show loading state
    //     submitBtn.disabled = true;
    //     btnText.textContent = 'Sending...';

    //     // Animate button
    //     gsap.to(submitBtn, {
    //         scale: 0.95,
    //         duration: 0.1,
    //         yoyo: true,
    //         repeat: 1,
    //         onComplete: () => {
    //             // Simulate form submission
    //             setTimeout(() => {
    //                 btnText.textContent = 'Message Sent!';
    //                 submitBtn.style.background = 'var(--color-success)';
                    
    //                 // Success animation
    //                 gsap.fromTo(submitBtn,
    //                     { scale: 0.9 },
    //                     { scale: 1, duration: 0.3, ease: "back.out(2)" }
    //                 );

    //                 // Reset form after delay
    //                 setTimeout(() => {
    //                     form.reset();
    //                     btnText.textContent = originalText;
    //                     submitBtn.style.background = '';
    //                     submitBtn.disabled = false;
    //                 }, 3000);
    //             }, 1500);
    //         }
    //     });
    // }

    /**
     * Smooth Scrolling
     */
    initSmoothScrolling() {
        // Handle CTA buttons
        document.querySelectorAll('[data-target]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const target = btn.getAttribute('data-target');
                this.scrollToSection(target);
            });
        });

        // Handle anchor links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                if (targetId) {
                    this.scrollToSection(targetId);
                }
            });
        });
    }

    /**
     * Scroll to section with smooth animation
     */
    scrollToSection(targetId) {
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;

        const offsetY = this.isMobile ? 80 : 100;
        
        gsap.to(window, {
            duration: 1.5,
            scrollTo: {
                y: targetElement,
                offsetY: offsetY
            },
            ease: "power3.inOut"
        });
    }

    /**
     * Performance Optimizations
     */
    initPerformanceOptimizations() {
        // Throttle scroll events
        this.throttledScroll = this.throttle(() => {
            this.isScrolling = false;
        }, 100);

        window.addEventListener('scroll', () => {
            this.isScrolling = true;
            this.throttledScroll();
        });

        // Optimize for low-end devices
        if (navigator.hardwareConcurrency <= 4 || navigator.deviceMemory <= 4) {
            gsap.globalTimeline.timeScale(1.5);
            ScrollTrigger.config({ limitCallbacks: true });
        }

        // Pause animations when page is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                gsap.globalTimeline.pause();
            } else {
                gsap.globalTimeline.resume();
            }
        });

        // Cleanup on unload
        window.addEventListener('beforeunload', () => {
            this.destroy();
        });
    }

    /**
     * Utility Functions
     */
    throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Cleanup
     */
    destroy() {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        gsap.globalTimeline.clear();
        window.removeEventListener('resize', this.handleResize);
    }
}

// Initialize when DOM is ready
const portfolio = new ModernPortfolio();

// Store globally for debugging
window.portfolio = portfolio;

// Handle reduced motion changes
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    if (e.matches) {
        gsap.globalTimeline.timeScale(100); // Effectively disable animations
    } else {
        gsap.globalTimeline.timeScale(1);
    }
});

// Enhanced console greeting
console.log(`
🚀 Welcome to Bhadraksh Bhargava's Portfolio
───────────────────────────────────────────
Built with love using:
• GSAP ScrollTrigger for smooth animations
• Modern ES6+ JavaScript
• Production-grade performance optimizations
• Accessibility-first approach

Portfolio ready and optimized! 🎉
`);

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModernPortfolio;
}