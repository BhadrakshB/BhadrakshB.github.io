// Add this to the existing app.js for the command palette "About Me" functionality

// Update the command palette initialization to handle the about page link
function handleAboutCommand() {
    window.location.href = 'about.html';
}

// Add event listener for the about command in the existing command palette code
// In the initCommandPalette method, add:
const aboutCommand = document.querySelector('[data-target="about"]');
if (aboutCommand) {
    aboutCommand.addEventListener('click', () => {
        window.location.href = 'about.html';
    });
}

// Also update theme toggle to work with header
const themeToggleHeader = document.getElementById('themeToggleHeader');
if (themeToggleHeader) {
    themeToggleHeader.addEventListener('click', () => toggleTheme());
}

function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    localStorage.setItem('theme', newTheme);

    setTheme(newTheme);

    // Update theme icon
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        themeIcon.textContent = newTheme === 'dark' ?  '☀️' : '🌙';
    }

    const themeToggleEl = document.querySelector('.theme-toggle');
    if (themeToggleEl) {
        if (newTheme === 'light') {
            themeToggleEl.style.backgroundColor = 'black';
        } else {
            themeToggleEl.style.backgroundColor = '#404142ff'; // Tailwind's gray-200
        }
    }
}

// Helper function to set the theme on the document
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}

// ----- Guide Orb: exact same behavior as app.js -----
(function initAboutOrb() {
    const start = () => {
        if (typeof gsap === 'undefined') return;
        const guideOrb = document.getElementById('guideOrb');
        if (!guideOrb) return;

        // show and pulse
        guideOrb.classList.add('pulse', 'visible');

        // Dimensions and motion params
        let centerX = 0;
        let centerY = 0;
        let amplitude = 100;
        let wavelength = 500; // full left->right->left

    // CTA tracking state (About page CTA button)
    // Anchor with text "Start a 20‑min Call →" has classes: btn-primary cta-btn inside .cta-actions
    const ctaButton = document.querySelector('.cta-actions .btn-primary.cta-btn');
        let stickyToCTA = false;
        let bounceTl = null;
        let orbRadius = 11;
        const bounceHeight = 48;
        const edgeMargin = 12;

        const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

        const computeDims = () => {
            centerX = window.innerWidth / 2;
            centerY = window.innerHeight / 2;
            const maxAmp = Math.min(centerX - 64, window.innerWidth * 0.45);
            amplitude = Math.max(80, maxAmp);
            wavelength = Math.max(480, Math.min(1400, window.innerHeight * 1.2));
        };

        const waveStep = () => {
            const scroll = window.scrollY || document.documentElement.scrollTop || 0;
            const cyc = (scroll / wavelength) % 2;
            const p = cyc <= 1 ? cyc : 2 - cyc;
            const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
            const orRect = guideOrb.getBoundingClientRect();
            orbRadius = orRect.width / 2 || orbRadius;
            const x = centerX - amplitude + (2 * amplitude) * eased - orbRadius;
            const y = centerY - orbRadius;
            gsap.to(guideOrb, { x, y, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
        };

        const getCtaTarget = () => {
            if (!ctaButton) return null;
            const orRect = guideOrb.getBoundingClientRect();
            orbRadius = orRect.width / 2 || orbRadius;
            const gap = clamp(window.innerWidth * 0.03, 12, 24);
            const rect = ctaButton.getBoundingClientRect();
            // Position to the LEFT side of the button
            let x = rect.left - gap - orbRadius;
            let y = rect.top + rect.height / 2 - orbRadius;
            x = clamp(x, edgeMargin, window.innerWidth - edgeMargin);
            y = clamp(y, edgeMargin, window.innerHeight - edgeMargin);
            return { x, y };
        };

        const startBounceToCTA = () => {
            if (!ctaButton) return;
            stickyToCTA = true;
            const base = getCtaTarget();
            if (!base) return;
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
            return ratio >= 0.6 && nearEnd;
        };

        const updateOrbMode = () => {
            if (isScrolling) {
                // while scrolling: no bouncing, keep wave updates
                if (bounceTl) { bounceTl.kill(); bounceTl = null; }
                stickyToCTA = false;
                waveStep();
                return;
            }

            if (ctaButton && shouldBounce()) {
                startBounceToCTA();
                return;
            }
            if (bounceTl) { bounceTl.kill(); bounceTl = null; }
            stickyToCTA = false;
            waveStep();
        };

        computeDims();
        setTimeout(updateOrbMode, 30);
        window.addEventListener('load', updateOrbMode, { once: true });
        // Scroll handling with debounce to detect scroll end
        let isScrolling = false;
        let scrollEndTimer = null;
        window.addEventListener('scroll', () => {
            isScrolling = true;
            updateOrbMode();
            if (scrollEndTimer) clearTimeout(scrollEndTimer);
            scrollEndTimer = setTimeout(() => {
                isScrolling = false;
                updateOrbMode(); // reevaluate at scroll end
            }, 160);
        }, { passive: true });
        window.addEventListener('resize', () => { computeDims(); updateOrbMode(); });
        const modeTick = setInterval(updateOrbMode, 250);
        window.addEventListener('beforeunload', () => clearInterval(modeTick));
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
