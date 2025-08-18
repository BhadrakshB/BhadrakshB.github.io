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
