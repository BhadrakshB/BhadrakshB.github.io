/**
 * Business-Focused Engineering Services Website
 * Outcome-driven design with single seed color system
 */

class BusinessFocusedSite {
    constructor() {
        this.currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        this.isScrolling = false;
        this.commandPaletteOpen = false;
        this.currentSolution = 0;

        this.solutionsMap = [
            {
                title: "Rapid cross‑platform delivery with Flutter",
                summary: "Single codebase for iOS and Android with native performance",
                outcome: "−40% eng hours",
                details: "Shared business logic, platform-specific UI, hot reload development"
            },
            {
                title: "Go/Gin microservices on Cloud Run",
                summary: "Event-driven architecture that scales automatically",
                outcome: "10× traffic",
                details: "RabbitMQ messaging, Docker containers, zero-downtime deployments"
            },
            {
                title: "Sub‑200ms funnels with React + FastAPI",
                summary: "Lightning-fast checkouts that convert",
                outcome: "+18% conversions",
                details: "Optimized queries, cached responses, streamlined UX"
            },
            {
                title: "AI‑ready graph + vector search",
                summary: "Neo4j + embeddings for intelligent recommendations",
                outcome: "New recommendations",
                details: "Knowledge graphs, semantic search, agentic workflows"
            }
        ];
        
        // Initialize on DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        // Register GSAP plugins
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
        
        // Initialize components
        this.initThemeSystem();
        this.initCommandPalette();
        this.initProblemSolutions();
        this.initPainPoints();
        // this.initContactForm();
        this.initScrollAnimations();
        this.initKeyboardShortcuts();
    }

    /**
     * Theme System
     */
    initThemeSystem() {
        const themeToggle = document.getElementById('themeToggle');
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.setTheme(savedTheme);
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // System theme change listener
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';

        localStorage.setItem('theme', newTheme);

        this.setTheme(newTheme);

        // Update theme icon
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) {
            themeIcon.textContent = newTheme === 'dark' ?  '☀️' : '🌙';
        }

        const themeToggleEl = document.querySelector('.theme-toggle');
        if (themeToggleEl) {
            if (this.currentTheme === 'light') {
            themeToggleEl.style.backgroundColor = 'black';
            } else {
            themeToggleEl.style.backgroundColor = '#404142ff'; // Tailwind's gray-200
            }
        }
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.className = theme;
    }

    /**
     * Command Palette
     */
    initCommandPalette() {
        const commandPalette = document.getElementById('commandPalette');
        const commandInput = document.getElementById('commandInput');
        const commandResults = document.getElementById('commandResults');
        
        if (!commandPalette) return;
        
        // Command items
        const commandItems = commandResults.querySelectorAll('.command-item');
        
        commandItems.forEach(item => {
            item.addEventListener('click', () => {
                const target = item.getAttribute('data-target');
                this.scrollToSection(target);
                this.closeCommandPalette();
            });
        });
        
        // Input filtering
        commandInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            
            commandItems.forEach(item => {
                const name = item.querySelector('.name').textContent.toLowerCase();
                const visible = name.includes(query);
                item.style.display = visible ? 'flex' : 'none';
            });
        });
        
        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.commandPaletteOpen) {
                this.closeCommandPalette();
            }
        });
        
        // Close on outside click
        commandPalette.addEventListener('click', (e) => {
            if (e.target === commandPalette) {
                this.closeCommandPalette();
            }
        });
    }

    openCommandPalette() {
        const commandPalette = document.getElementById('commandPalette');
        const commandInput = document.getElementById('commandInput');
        
        if (commandPalette) {
            commandPalette.classList.remove('hidden');
            this.commandPaletteOpen = true;
            commandInput.focus();
        }
    }

    closeCommandPalette() {
        const commandPalette = document.getElementById('commandPalette');
        const commandInput = document.getElementById('commandInput');
        
        if (commandPalette) {
            commandPalette.classList.add('hidden');
            this.commandPaletteOpen = false;
            commandInput.value = '';
            
            // Reset visibility of all items
            const commandItems = document.querySelectorAll('.command-item');
            commandItems.forEach(item => {
                item.style.display = 'flex';
            });
        }
    }

    /**
     * Problem → Solution Interactive Grid
     */
    initProblemSolutions() {
        const problemCards = document.querySelectorAll('.problem-card');
        const solutionContents = document.querySelectorAll('.solution-content');

   

        problemCards.forEach((card, index) => {
            card.addEventListener('click', () => {
            // Update active problem card
            problemCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            // Update solution content using solutionsMap
            const solutionData = this.solutionsMap[index];
            const targetSolution = document.querySelector('.solution-content');

            if (solutionData && targetSolution) {
                targetSolution.querySelector('.solution-title').textContent = solutionData.title;
                targetSolution.querySelector('.solution-summary').textContent = solutionData.summary;
                targetSolution.querySelector('.solution-outcome').textContent = solutionData.outcome;
                targetSolution.querySelector('.solution-details').textContent = solutionData.details;
            }

            this.currentSolution = index;
            });
        });
    }

    /**
     * Pain Points Selection
     */
    initPainPoints() {
        const painPills = document.querySelectorAll('.pain-pill');
        
        painPills.forEach(pill => {
            pill.addEventListener('click', () => {
                painPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
            });
        });
    }

    /**
     * Contact Form
     */
    // initContactForm() {
    //     const contactForm = document.getElementById('contactForm');
    //     const formSuccess = document.getElementById('formSuccess');
        
    //     if (contactForm) {
    //         contactForm.addEventListener('submit', (e) => {
    //             e.preventDefault();
                
    //             // Simulate form submission
    //             const submitBtn = contactForm.querySelector('.form-submit');
    //             const originalText = submitBtn.textContent;
                
    //             submitBtn.textContent = 'Sending...';
    //             submitBtn.disabled = true;
                
    //             setTimeout(() => {
    //                 contactForm.style.display = 'none';
    //                 formSuccess.classList.remove('hidden');
    //             }, 1000);
    //         });
    //     }
    // }

    /**
     * Scroll Animations
     */
    initScrollAnimations() {
        // Fade in animations
        const fadeElements = document.querySelectorAll('.fade-in');
        
        fadeElements.forEach(element => {
            gsap.fromTo(element, 
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
        
        // Stagger animations for grids
        const staggerContainers = document.querySelectorAll('.services-grid, .proof-carousel, .outcomes-grid');
        
        staggerContainers.forEach(container => {
            const children = container.children;
            
            gsap.fromTo(children,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: "power2.out",
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: container,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
        
        // Outcome bars animation
        const outcomeBars = document.querySelectorAll('.outcome-fill');
        
        outcomeBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            
            gsap.to(bar, {
                width: width,
                duration: 1.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: bar,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        // About page CTA entrance animation (if present)
        const cta = document.querySelector('.cta-content');
        if (cta) {
            gsap.fromTo(cta,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: cta,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }

    // Dynamic orbs parallax (cta only)
    const parallaxOrbs = document.querySelectorAll('.cta-orb');
        if (parallaxOrbs.length) {
            parallaxOrbs.forEach((orb, i) => {
                const strength = (i % 2 === 0) ? 8 : 12;
                gsap.to(orb, {
                    yPercent: 10,
                    duration: 10,
                    ease: 'none',
                    repeat: -1,
                    yoyo: true
                });
                gsap.to(orb, {
                    x: `+=${strength}`,
                    duration: 6 + i,
                    ease: 'sine.inOut',
                    repeat: -1,
                    yoyo: true
                });
            });
        }

        // Count-up stats in personal hero
        const statValues = document.querySelectorAll('.stat-value');
        statValues.forEach((el) => {
            const finalText = el.textContent.trim();
            const isPlus = finalText.endsWith('+');
            const final = parseInt(finalText.replace(/[^0-9]/g, ''), 10);
            if (!isNaN(final)) {
                el.textContent = '0' + (isPlus ? '+' : '');
                gsap.to({ n: 0 }, {
                    n: final,
                    duration: 1.2,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        once: true
                    },
                    onUpdate: function() {
                        const value = Math.round(this.targets()[0].n);
                        el.textContent = value + (isPlus ? '+' : '');
                    }
                });
            }
        });

        // Stagger reveals for grids on About page
        const aboutStaggers = document.querySelectorAll('.education-item, .skill-category, .experience-item, .project-card, .leadership-item, .certification-item, .interest-item');
        if (aboutStaggers.length) {
            gsap.from(aboutStaggers, {
                opacity: 0,
                y: 20,
                duration: 0.6,
                ease: 'power2.out',
                stagger: 0.08,
                scrollTrigger: {
                    trigger: '.about-page',
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            });
        }

    // Subtle tilt on hover for cards
        const tiltCards = document.querySelectorAll('.experience-item, .project-card, .leadership-item, .certification-item');
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (e.clientX - cx) / rect.width;
                const dy = (e.clientY - cy) / rect.height;
                gsap.to(card, { rotateY: dx * 6, rotateX: -dy * 6, duration: 0.2, transformPerspective: 800 });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.3, ease: 'power2.out' });
            });
        });

        // Personal hero entry animations (using existing elements)
        const heroSection = document.querySelector('#personal-hero');
        if (heroSection) {
            const heroTl = gsap.timeline({
                scrollTrigger: {
                    trigger: heroSection,
                    start: 'top 75%',
                    once: true
                }
            });
            const title = heroSection.querySelector('.personal-title');
            const subtitle = heroSection.querySelector('.personal-subtitle');
            const stats = heroSection.querySelectorAll('.stat-item');
            const contact = heroSection.querySelector('.personal-contact');
            const links = heroSection.querySelectorAll('.personal-links .btn-primary, .personal-links .btn-secondary');

            if (title) heroTl.from(title, { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' });
            if (subtitle) heroTl.from(subtitle, { opacity: 0, y: 18, duration: 0.45, ease: 'power2.out' }, '-=0.25');
            if (stats && stats.length) heroTl.from(stats, { opacity: 0, y: 16, stagger: 0.08, duration: 0.4, ease: 'power2.out' }, '-=0.2');
            if (contact) heroTl.from(contact, { opacity: 0, y: 16, duration: 0.4, ease: 'power2.out' }, '-=0.15');
            if (links && links.length) heroTl.from(links, { opacity: 0, y: 12, stagger: 0.06, duration: 0.35, ease: 'power2.out' }, '-=0.15');
        }

        // Guide orb: wavy motion by default; when Contact section is in view, bounce to the right of the submit button and stick there
        const guideOrb = document.getElementById('guideOrb');
        if (guideOrb) {
            guideOrb.classList.add('pulse', 'visible');

            // Wavy defaults
            let centerX = 0;
            let centerY = 0;
            let amplitude = 100; // px
            let wavelength = 500; // px of scroll per full cycle (left->right->left)

            // CTA tracking state
            const contactSection = document.getElementById('contact');
            const ctaButton = document.querySelector('#contact .form-submit');
            let stickyToCTA = false;
            let bouncing = false; // legacy flag, preserved
            let bounceTl = null;  // continuous bounce timeline
            let orbRadius = 11; // will update from DOM
            const bounceHeight = 48; // taller bounce
            const edgeMargin = 12; // keep orb fully on screen

            const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

            const computeDims = () => {
                centerX = window.innerWidth / 2;
                centerY = window.innerHeight / 2;
                // Push toward edges but keep a safe margin
                const maxAmp = Math.min(centerX - 64, window.innerWidth * 0.45);
                amplitude = Math.max(80, maxAmp);
                // Longer wavelength to linger near edges
                wavelength = Math.max(480, Math.min(1400, window.innerHeight * 1.2));
            };

            const waveStep = () => {
                const scroll = window.scrollY || document.documentElement.scrollTop || 0;
                // Ping-pong progress 0->1->0 with cubic ease to dwell near edges
                const cyc = (scroll / wavelength) % 2; // [0,2)
                const p = cyc <= 1 ? cyc : 2 - cyc; // [0,1]
                // cubic easeInOut
                const eased = p < 0.5
                    ? 4 * p * p * p
                    : 1 - Math.pow(-2 * p + 2, 3) / 2;
                const orRect = guideOrb.getBoundingClientRect();
                orbRadius = orRect.width / 2 || orbRadius;
                const x = centerX - amplitude + (2 * amplitude) * eased - orbRadius;
                const y = centerY - orbRadius;
                // slightly longer duration for smoother glide between updates
                gsap.to(guideOrb, { x, y, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
            };

            const getCtaTarget = () => {
                if (!ctaButton) return;
                // compute dynamic offset: orb radius + gap that scales with viewport
                const orRect = guideOrb.getBoundingClientRect();
                orbRadius = orRect.width / 2 || orbRadius;
                const gap = clamp(window.innerWidth * 0.03, 12, 24);
                const rect = ctaButton.getBoundingClientRect();
                // position x/y represent top-left; subtract radius to center orb precisely
                let x = rect.right + gap - orbRadius; // orb left edge + radius aligns at gap from button
                let y = rect.top + rect.height / 2 - orbRadius;
                // clamp inside viewport
                x = clamp(x, edgeMargin, window.innerWidth - edgeMargin);
                y = clamp(y, edgeMargin, window.innerHeight - edgeMargin);
                return { x, y };
            };

            const followCTA = () => {
                const tgt = getCtaTarget();
                if (!tgt) return;
                gsap.to(guideOrb, { x: tgt.x, y: tgt.y, duration: 0.18, ease: 'sine.out', overwrite: 'auto' });
            };

                        const startBounceToCTA = () => {
                            if (!ctaButton) return;
                            stickyToCTA = true;
                            const base = getCtaTarget();
                            if (!base) return;
                            // Dock to the exact side of CTA, then bounce around that base
                            gsap.to(guideOrb, { x: base.x, y: base.y, duration: 0.2, ease: 'power3.out', overwrite: 'auto' });
                            if (bounceTl) return;
                            bounceTl = gsap.to(guideOrb, {
                                duration: 0.2,
                                x: () => (getCtaTarget() || base).x,
                                y: () => (getCtaTarget() || base).y - bounceHeight,
                                ease: 'power1.inOut',
                                yoyo: true,
                                repeat: -1,
                                repeatDelay: 0.05,
                                repeatRefresh: true,
                                overwrite: 'auto'
                            });
                        };

            // End detection: CTA mostly visible AND near document end
            const shouldBounce = () => {
                const doc = document.documentElement;
                const scrollTop = window.scrollY || doc.scrollTop || 0;
                const viewport = window.innerHeight;
                const total = doc.scrollHeight;
                const remaining = total - (scrollTop + viewport);
                if (!ctaButton) return remaining <= Math.max(140, viewport * 0.1);
                const r = ctaButton.getBoundingClientRect();
                const visibleH = Math.max(0, Math.min(r.bottom, viewport) - Math.max(r.top, 0));
                const ratio = r.height > 0 ? visibleH / r.height : 0;
                const nearEnd = remaining <= Math.max(160, viewport * 0.12);
                // Bounce when CTA is at least 60% visible and we're near the end
                return ratio >= 0.6 && nearEnd;
            };
            // Hysteresis threshold to stop bouncing so it doesn't flicker on edges
            const shouldStopBounce = () => {
                const doc = document.documentElement;
                const scrollTop = window.scrollY || doc.scrollTop || 0;
                const viewport = window.innerHeight;
                const total = doc.scrollHeight;
                const remaining = total - (scrollTop + viewport);
                const progress = (scrollTop + viewport) / total;
                return remaining > Math.max(180, viewport * 0.12) && progress < 0.92;
            };

            const updateOrbMode = () => {
                if (ctaButton && shouldBounce()) {
                    startBounceToCTA();
                    return; // near bottom or CTA in view at end, keep bouncing
                }
                // if out of the end zone, resume wave
                if (bounceTl) { bounceTl.kill(); bounceTl = null; }
                stickyToCTA = false;
                waveStep();
            };

            computeDims();
            setTimeout(updateOrbMode, 30);
            window.addEventListener('load', updateOrbMode, { once: true });
            window.addEventListener('scroll', updateOrbMode, { passive: true });
            window.addEventListener('resize', () => { computeDims(); updateOrbMode(); });
            // periodic tick to ensure state updates even if scroll events are throttled
            const modeTick = setInterval(updateOrbMode, 250);
            window.addEventListener('beforeunload', () => clearInterval(modeTick));
        }
    }

    /**
     * Keyboard Shortcuts
     */
    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Command palette toggle (Cmd+K or Ctrl+K)
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                if (this.commandPaletteOpen) {
                    this.closeCommandPalette();
                } else {
                    this.openCommandPalette();
                }
            }
        });
    }
    

    /**
     * Smooth scroll to section
     */
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            gsap.to(window, {
                duration: 1,
                scrollTo: {
                    y: section,
                    offsetY: 50
                },
                ease: "power2.inOut"
            });
        }
    }
}

// Global scroll function for inline onclick handlers
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        gsap.to(window, {
            duration: 1,
            scrollTo: {
                y: section,
                offsetY: 50
            },
            ease: "power2.inOut"
        });
    }
}

// Initialize the site
new BusinessFocusedSite();
