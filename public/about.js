/* ============================================================
   ABOUT CINEMATIC CONTROLLER
   ============================================================ */

(function() {
    const $ = (sel, el = document) => el.querySelector(sel);
    const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
    const isMobile = window.innerWidth <= 775;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const enableCinematic = !isMobile && !reducedMotion;

    // ============================================================
    // COMMAND PALETTE
    // ============================================================
    const palette = $('#commandPalette');
    const input = $('#commandInput');
    let paletteOpen = false;

    function openPalette() {
        if (!palette) return;
        palette.classList.remove('hidden');
        paletteOpen = true;
        input && input.focus();
    }
    function closePalette() {
        if (!palette) return;
        palette.classList.add('hidden');
        paletteOpen = false;
        if (input) input.value = '';
        $$('.command-item').forEach(i => i.style.display = 'flex');
    }

    $('#commandButton')?.addEventListener('click', () => paletteOpen ? closePalette() : openPalette());
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            paletteOpen ? closePalette() : openPalette();
        }
        if (e.key === 'Escape' && paletteOpen) closePalette();
    });
    palette?.addEventListener('click', (e) => { if (e.target === palette) closePalette(); });

    $$('.command-item').forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');
            if (target) {
                const el = document.getElementById(target);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            closePalette();
        });
    });

    input?.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        $$('.command-item').forEach(item => {
            const name = item.querySelector('.name')?.textContent.toLowerCase() || '';
            item.style.display = name.includes(q) ? 'flex' : 'none';
        });
    });

    // ============================================================
    // RESUME DOWNLOAD
    // ============================================================
    window.downloadResume = function() {
        const url = "https://daloctypx7lhk4xo.public.blob.vercel-storage.com/Bhadraksh%20Bhargava.pdf";
        fetch(url, { method: 'HEAD' })
            .then(res => {
                if (res.ok) {
                    const a = document.createElement('a');
                    a.href = url; a.setAttribute('download', ''); a.rel = 'noopener';
                    document.body.appendChild(a); a.click(); a.remove();
                } else throw new Error('Unavailable');
            })
            .catch(() => alert("Resume isn't available. Email me: bhadrakshbhargava@gmail.com"));
    };

    // ============================================================
    // CINEMATIC SCENES
    // ============================================================
    if (!enableCinematic || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        if (typeof gsap !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            $$('.scene').forEach(scene => {
                const layers = $$('[data-layer]', scene);
                if (layers.length) {
                    gsap.from(layers, { opacity: 0, y: 30, duration: 0.6, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: scene, start: 'top 80%' } });
                }
            });
        }
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    function splitText(el) {
        if (typeof SplitType === 'undefined' || !el) return null;
        return new SplitType(el, { types: 'chars,lines' });
    }

    function createScene(triggerSel, endOffset, tl) {
        const el = $(triggerSel);
        if (!el) return null;
        return ScrollTrigger.create({
            trigger: el, start: 'top top', end: '+=' + endOffset,
            pin: true, scrub: 0.6, animation: tl,
            anticipatePin: 1, invalidateOnRefresh: true
        });
    }

    // ---------- ABOUT HERO (auto-play entrance, not pinned) ----------
    const aboutTitle = $('.personal-title');
    const aboutSplit = splitText(aboutTitle);
    const aboutChars = aboutSplit?.chars || [];

    // Auto-play entrance on page load
    const aboutEntrance = gsap.timeline({ delay: 0.2 });
    aboutEntrance.fromTo(aboutChars, { opacity: 0, rotateX: -90, z: -300, y: 60 }, { opacity: 1, rotateX: 0, z: 0, y: 0, stagger: 0.018, ease: 'back.out(1.4)', duration: 0.4 }, 0);
    aboutEntrance.fromTo('[data-scene="about-hero"] [data-layer="label"]', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.25 }, 0.15);
    aboutEntrance.fromTo('[data-scene="about-hero"] [data-layer="subtitle"]', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.2 }, 0.22);
    aboutEntrance.fromTo('[data-scene="about-hero"] [data-layer="stats"]', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.2 }, 0.3);
    aboutEntrance.fromTo('[data-scene="about-hero"] [data-layer="contact"]', { opacity: 0 }, { opacity: 1, duration: 0.15 }, 0.38);
    aboutEntrance.fromTo('[data-scene="about-hero"] [data-layer="links"]', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.15 }, 0.42);

    // Subtle scroll fade-out as user scrolls past
    gsap.fromTo('.about-hero-scene', { opacity: 1, y: 0 }, {
        opacity: 0,
        y: -60,
        ease: 'power2.in',
        scrollTrigger: { trigger: '.about-hero-scene', start: '40% top', end: 'bottom top', scrub: 0.5 }
    });

    // ---------- EXPERIENCE (not pinned — tall content) ----------
    const expSection = $('.experience-scene');
    if (expSection) {
        const expItems = $$('.experience-item');
        gsap.fromTo('[data-scene="experience"] [data-layer="header"]', { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: expSection, start: 'top 80%' } });
        expItems.forEach((item, i) => {
            gsap.fromTo(item, { opacity: 0, x: i % 2 === 0 ? -60 : 60, rotateY: i % 2 === 0 ? 10 : -10 }, { opacity: 1, x: 0, rotateY: 0, duration: 0.8, delay: i * 0.12, ease: 'power3.out', scrollTrigger: { trigger: item, start: 'top 85%' } });
            gsap.fromTo(item.querySelectorAll('li'), { opacity: 0, x: -10 }, { opacity: 1, x: 0, stagger: 0.05, duration: 0.4, ease: 'power2.out', scrollTrigger: { trigger: item, start: 'top 80%' } });
        });
    }

    // ---------- PROJECTS (not pinned — tall content) ----------
    const projSection = $('.projects-scene');
    if (projSection) {
        const projCards = $$('.project-card');
        gsap.fromTo('[data-scene="projects"] [data-layer="header"]', { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: projSection, start: 'top 80%' } });
        projCards.forEach((card, i) => {
            gsap.fromTo(card, { opacity: 0, y: 80, rotateX: 15, scale: 0.95 }, { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 0.8, delay: i * 0.1, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 90%' } });
        });
        gsap.fromTo('.project-highlights .highlight', { opacity: 0, x: -10 }, { opacity: 1, x: 0, stagger: 0.04, duration: 0.3, ease: 'power2.out', scrollTrigger: { trigger: '.projects-grid', start: 'top 80%' } });
    }

    // ---------- SKILLS (not pinned — moderate height, safer as scroll) ----------
    const skillSection = $('.skills-scene');
    if (skillSection) {
        const skillCats = $$('.skill-category');
        gsap.fromTo('[data-scene="skills"] [data-layer="header"]', { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: skillSection, start: 'top 80%' } });
        skillCats.forEach((cat, i) => {
            gsap.fromTo(cat, { opacity: 0, y: 40, rotateX: 12 }, { opacity: 1, y: 0, rotateX: 0, duration: 0.6, delay: i * 0.08, ease: 'power2.out', scrollTrigger: { trigger: cat, start: 'top 90%' } });
        });
        gsap.fromTo('.skill-tag', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, stagger: 0.02, duration: 0.3, ease: 'back.out(1.4)', scrollTrigger: { trigger: '.skills-grid', start: 'top 80%' } });
    }

    // ---------- EDUCATION (not pinned) ----------
    const eduSection = $('.education-scene');
    if (eduSection) {
        const eduItems = $$('.education-item');
        gsap.fromTo('[data-scene="education"] [data-layer="header"]', { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: eduSection, start: 'top 80%' } });
        eduItems.forEach((item, i) => {
            gsap.fromTo(item, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.7, delay: i * 0.12, ease: 'power2.out', scrollTrigger: { trigger: item, start: 'top 85%' } });
        });
    }

    // ---------- LEADERSHIP (not pinned — two columns, tall content) ----------
    const leadSection = $('.leadership-scene');
    if (leadSection) {
        const leadItems = $$('.leadership-item');
        const certItems = $$('.certification-item');
        gsap.fromTo('[data-scene="leadership"] [data-layer="content"]', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: leadSection, start: 'top 80%' } });
        leadItems.forEach((item, i) => {
            gsap.fromTo(item, { opacity: 0, x: -40, rotateY: 8 }, { opacity: 1, x: 0, rotateY: 0, duration: 0.7, delay: i * 0.1, ease: 'power3.out', scrollTrigger: { trigger: item, start: 'top 90%' } });
        });
        certItems.forEach((item, i) => {
            gsap.fromTo(item, { opacity: 0, x: 40, rotateY: -8 }, { opacity: 1, x: 0, rotateY: 0, duration: 0.6, delay: i * 0.08, ease: 'power3.out', scrollTrigger: { trigger: item, start: 'top 90%' } });
        });
    }

    // ---------- INTERESTS (not pinned) ----------
    const intSection = $('.interests-scene');
    if (intSection) {
        const intItems = $$('.interest-item');
        gsap.fromTo('[data-scene="interests"] [data-layer="header"]', { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: intSection, start: 'top 80%' } });
        intItems.forEach((item, i) => {
            gsap.fromTo(item, { opacity: 0, scale: 0.85, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.6, delay: i * 0.08, ease: 'back.out(1.4)', scrollTrigger: { trigger: item, start: 'top 90%' } });
        });
    }

    // ---------- CTA (not pinned) ----------
    const ctaSection = $('.cta-scene');
    if (ctaSection) {
        gsap.fromTo('.cta-content', { opacity: 0, rotateX: 12, y: 40, scale: 0.95, transformOrigin: 'center center' }, { opacity: 1, rotateX: 0, y: 0, scale: 1, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: ctaSection, start: 'top 80%' } });
        gsap.fromTo('.cta-badge', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.4, delay: 0.2, ease: 'back.out(1.4)', scrollTrigger: { trigger: ctaSection, start: 'top 80%' } });
        gsap.fromTo('.cta-actions', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, delay: 0.3, ease: 'power2.out', scrollTrigger: { trigger: ctaSection, start: 'top 80%' } });
    }
})();
