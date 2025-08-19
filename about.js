/**
 * About Page Script: mirrors app.js structure
 */

class BusinessFocusedSite {
    constructor() {
        this.currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        this.isScrolling = false;
        this.commandPaletteOpen = false;
        this.currentSolution = 0;

        this.solutionsMap = [
            {
                title: "Flutter MVP development: iOS & Android from one codebase",
                summary: "Single codebase for iOS and Android with native performance",
                outcome: "-40% engineering hours to first release",
                details: "Challenge: slow dual-platform delivery. Approach: shared logic, platform-specific UI, CI for both stores. Result: cut cycle time 40% with 99.9% crash-free."
            },
            {
                title: "Go/Gin microservices on Cloud Run",
                summary: "Event-driven architecture that scales automatically",
                outcome: "10x traffic",
                details: "RabbitMQ messaging, Docker containers, zero-downtime deployments"
            },
            {
                title: "Sub-200ms funnels with React + FastAPI",
                summary: "Lightning-fast checkouts that convert",
                outcome: "+18% conversions",
                details: "Optimized queries, cached responses, streamlined UX"
            },
            {
                title: "AI-ready graph + vector search",
                summary: "Neo4j + embeddings for intelligent recommendations",
                outcome: "New recommendations",
                details: "Knowledge graphs, semantic search, agentic workflows"
            }
        ];

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && typeof ScrollToPlugin !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
        }

        this.initThemeSystem();
        this.initCommandPalette();
        this.initProblemSolutions();
        this.initPainPoints();
        this.initScrollAnimations();
        this.initKeyboardShortcuts();
    }

    initThemeSystem() {
        const themeToggle = document.getElementById('themeToggle');
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.setTheme(savedTheme);
        this.updateThemeUI();
        if (themeToggle) themeToggle.addEventListener('click', () => this.toggleTheme());
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
        this.updateThemeUI();
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.className = theme;
    }

    updateThemeUI() {
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) themeIcon.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
        const themeToggleEl = document.querySelector('.theme-toggle');
        if (themeToggleEl) themeToggleEl.style.backgroundColor = this.currentTheme === 'light' ? 'black' : '#404142ff';
        const commandButtonEl = document.querySelector('.command-button');
        if (commandButtonEl) commandButtonEl.style.backgroundColor = this.currentTheme === 'light' ? 'black' : '#404142ff';
        const commandIcon = document.getElementById('command-icon');
        if (commandIcon) commandIcon.style.color = 'white';
    }

    initCommandPalette() {
        const commandPalette = document.getElementById('commandPalette');
        const commandInput = document.getElementById('commandInput');
        const commandResults = document.getElementById('commandResults');
        if (!commandPalette) return;
        const commandItems = commandResults.querySelectorAll('.command-item');
        commandItems.forEach(item => {
            item.addEventListener('click', () => {
                const target = item.getAttribute('data-target');
                this.scrollToSection(target);
                this.closeCommandPalette();
            });
        });
        commandInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            commandItems.forEach(item => {
                const name = item.querySelector('.name').textContent.toLowerCase();
                item.style.display = name.includes(query) ? 'flex' : 'none';
            });
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.commandPaletteOpen) this.closeCommandPalette();
        });
        commandPalette.addEventListener('click', (e) => {
            if (e.target === commandPalette) this.closeCommandPalette();
        });
    }

    openCommandPalette() {
        const commandPalette = document.getElementById('commandPalette');
        const commandInput = document.getElementById('commandInput');
        if (commandPalette) {
            commandPalette.classList.remove('hidden');
            this.commandPaletteOpen = true;
            if (commandInput) commandInput.focus();
        }
    }

    closeCommandPalette() {
        const commandPalette = document.getElementById('commandPalette');
        const commandInput = document.getElementById('commandInput');
        if (commandPalette) {
            commandPalette.classList.add('hidden');
            this.commandPaletteOpen = false;
            if (commandInput) commandInput.value = '';
            document.querySelectorAll('.command-item').forEach(i => i.style.display = 'flex');
        }
    }

    initProblemSolutions() {
        const problemCards = document.querySelectorAll('.problem-card');
        const solutionContents = document.querySelectorAll('.solution-content');
        problemCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                problemCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
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

    initPainPoints() {
        const painPills = document.querySelectorAll('.pain-pill');
        painPills.forEach(pill => {
            pill.addEventListener('click', () => {
                painPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
            });
        });
    }

    initScrollAnimations() {
        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach(element => {
            if (typeof gsap === 'undefined') return;
            gsap.fromTo(element,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
                    scrollTrigger: { trigger: element, start: 'top 80%', toggleActions: 'play none none reverse' }
                }
            );
        });

        const staggerContainers = document.querySelectorAll('.services-grid, .proof-carousel, .outcomes-grid');
        staggerContainers.forEach(container => {
            if (typeof gsap === 'undefined') return;
            const children = container.children;
            gsap.fromTo(children,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1,
                    scrollTrigger: { trigger: container, start: 'top 80%', toggleActions: 'play none none reverse' }
                }
            );
        });

        const outcomeBars = document.querySelectorAll('.outcome-fill');
        outcomeBars.forEach(bar => {
            if (typeof gsap === 'undefined') return;
            const width = bar.style.width;
            bar.style.width = '0%';
            gsap.to(bar, { width: width, duration: 1.2, ease: 'power2.out',
                scrollTrigger: { trigger: bar, start: 'top 80%', toggleActions: 'play none none reverse' }
            });
        });

        const cta = document.querySelector('.cta-content');
        if (cta && typeof gsap !== 'undefined') {
            gsap.fromTo(cta, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
                scrollTrigger: { trigger: cta, start: 'top 85%', toggleActions: 'play none none reverse' }
            });
        }

        const parallaxOrbs = document.querySelectorAll('.cta-orb');
        if (parallaxOrbs.length && typeof gsap !== 'undefined') {
            parallaxOrbs.forEach((orb, i) => {
                const strength = (i % 2 === 0) ? 8 : 12;
                gsap.to(orb, { yPercent: 10, duration: 10, ease: 'none', repeat: -1, yoyo: true });
                gsap.to(orb, { x: `+=${strength}`, duration: 6 + i, ease: 'sine.inOut', repeat: -1, yoyo: true });
            });
        }

        const statValues = document.querySelectorAll('.stat-value');
        if (typeof gsap !== 'undefined') {
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
                        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
                        onUpdate: function() {
                            const value = Math.round(this.targets()[0].n);
                            el.textContent = value + (isPlus ? '+' : '');
                        }
                    });
                }
            });
        }

        const aboutStaggers = document.querySelectorAll('.education-item, .skill-category, .experience-item, .project-card, .leadership-item, .certification-item, .interest-item');
        if (aboutStaggers.length && typeof gsap !== 'undefined') {
            aboutStaggers.forEach(el => {
                gsap.from(el, {
                    opacity: 0,
                    y: 20,
                    duration: 0.6,
                    ease: 'power2.out',
                    immediateRender: false,
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 90%',
                        toggleActions: 'play none none reverse'
                    }
                });
            });
        }

        // Guide orb with snap-to-CTA after scroll ends
        const guideOrb = document.getElementById('guideOrb');
        if (guideOrb && typeof gsap !== 'undefined') {
            guideOrb.classList.add('pulse', 'visible');

            let centerX = 0, centerY = 0, amplitude = 100, wavelength = 500;
            let orbRadius = 11;
            const edgeMargin = 12;
            const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
            const ctaButton = document.querySelector('.cta-content .btn-primary.cta-btn')
                || document.querySelector('.cta-content .cta-btn')
                || document.querySelector('.cta-content .btn-primary');

            let isScrolling = false;
            let scrollEndTimer = null;
            let snapped = false;

            const computeDims = () => {
                centerX = window.innerWidth / 2; centerY = window.innerHeight / 2;
                const maxAmp = Math.min(centerX - 64, window.innerWidth * 0.45);
                amplitude = Math.max(80, maxAmp);
                wavelength = Math.max(480, Math.min(1400, window.innerHeight * 1.2));
                const orRect = guideOrb.getBoundingClientRect();
                if (orRect && orRect.width) orbRadius = orRect.width / 2;
            };

            const waveStep = () => {
                const scroll = window.scrollY || document.documentElement.scrollTop || 0;
                const cyc = (scroll / wavelength) % 2; const p = cyc <= 1 ? cyc : 2 - cyc;
                const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
                const x = centerX - amplitude + (2 * amplitude) * eased - orbRadius;
                const y = centerY - orbRadius;
                gsap.to(guideOrb, { x, y, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
            };

            const isCTAInViewport = () => {
                if (!ctaButton) return false;
                const rect = ctaButton.getBoundingClientRect();
                return rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
            };

            const snapToCTA = () => {
                if (!ctaButton) return;
                const rect = ctaButton.getBoundingClientRect();
                const remPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
                const extraLeft = 2 * remPx; // 2rem farther to the left
                const targetX = clamp(rect.left - extraLeft - orbRadius - 14, edgeMargin, window.innerWidth - orbRadius * 2 - edgeMargin);
                const targetY = clamp(rect.top + rect.height / 2 - orbRadius, edgeMargin, window.innerHeight - orbRadius * 2 - edgeMargin);

                // restart ping animation
                guideOrb.classList.remove('ping');
                // force reflow
                void guideOrb.offsetWidth;
                guideOrb.classList.add('ping');

                gsap.to(guideOrb, { x: targetX, y: targetY, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
                snapped = true;
            };

            // Initial set
            computeDims();
            waveStep();

            // Scroll handling: wave while scrolling, snap when it ends and CTA is visible
        const onScroll = () => {
                isScrolling = true;
                snapped = false;
                waveStep();
                if (scrollEndTimer) clearTimeout(scrollEndTimer);
                scrollEndTimer = setTimeout(() => {
                    isScrolling = false;
                    if (isCTAInViewport()) snapToCTA();
                }, 200);
            };

            window.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('resize', () => {
                computeDims();
                if (snapped && isCTAInViewport()) {
                    snapToCTA();
                } else {
                    waveStep();
                }
            });
            window.addEventListener('load', () => {
                // If CTA starts in view (deep link near bottom), snap shortly after load
                setTimeout(() => { if (isCTAInViewport()) snapToCTA(); }, 250);
            }, { once: true });

            // Keep subtle motion when idle and not snapped
            const idleTick = setInterval(() => { if (!isScrolling && !snapped) waveStep(); }, 400);
            window.addEventListener('beforeunload', () => clearInterval(idleTick));
        }
    }

    initKeyboardShortcuts() {
        const commandIcon = document.querySelector('.command-icon');
        if (commandIcon) {
            commandIcon.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.commandPaletteOpen) { this.closeCommandPalette(); } else { this.openCommandPalette(); }
            });
        }
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                if (this.commandPaletteOpen) { this.closeCommandPalette(); } else { this.openCommandPalette(); }
            }
        });
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section && typeof gsap !== 'undefined') {
            gsap.to(window, { duration: 1, scrollTo: { y: section, offsetY: 50 }, ease: 'power2.inOut' });
        } else if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// Global scroll function for inline handlers
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section && typeof gsap !== 'undefined') {
        gsap.to(window, { duration: 1, scrollTo: { y: section, offsetY: 50 }, ease: 'power2.inOut' });
    } else if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Initialize the site for About page
new BusinessFocusedSite();

// Expose a robust Resume downloader for the inline onclick in about.html
// Tries a few common paths and downloads the first available PDF.
window.downloadResume = function downloadResume() {
    const candidates = [
        "https://daloctypx7lhk4xo.public.blob.vercel-storage.com/Bhadraksh%20Bhargava.pdf"
    ];

    const tryNext = (i) => {
        if (i >= candidates.length) {
            alert("Resume isn't available right now. Please email bhadrakshbhargava@gmail.com and I'll send it over.");
            return;
        }
        const url = candidates[i];
        fetch(url, { method: 'HEAD' })
            .then((res) => {
                if (res.ok) {
                    const a = document.createElement('a');
                    a.href = url;
                    a.setAttribute('download', '');
                    a.rel = 'noopener';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                } else {
                    tryNext(i + 1);
                }
            })
            .catch(() => tryNext(i + 1));
    };

    tryNext(0);
};
