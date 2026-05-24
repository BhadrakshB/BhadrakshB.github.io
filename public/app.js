/* ============================================================
   CINEMATIC APP CONTROLLER
   ============================================================ */

(function() {
    const $ = (sel, el = document) => el.querySelector(sel);
    const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
    const isMobile = window.innerWidth <= 775;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const enableCinematic = !isMobile && !reducedMotion;

    // ============================================================
    // LENIS SMOOTH SCROLL
    // ============================================================
    let lenis;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => { lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);
    }

    // ============================================================
    // HEADER VISIBILITY
    // ============================================================
    const header = $('#header');
    let lastScroll = 0;
    function onScrollHeader() {
        const y = window.scrollY || 0;
        if (y > 100) header?.classList.add('visible');
        else header?.classList.remove('visible');
        lastScroll = y;
    }
    window.addEventListener('scroll', onScrollHeader, { passive: true });

    // ============================================================
    // SCROLL PROGRESS
    // ============================================================
    const progressFill = $('.scroll-progress-fill');
    if (progressFill && typeof gsap !== 'undefined') {
        gsap.to(progressFill, {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 }
        });
        gsap.set(progressFill, { transformOrigin: 'left', scaleX: 0 });
    }

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
                if (el) {
                    if (lenis) lenis.scrollTo(el, { offset: -64 });
                    else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
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
    // PROBLEM / SOLUTION
    // ============================================================
    const problems = $$('.problem-card');
    const solutions = [
        { title: 'Flutter cross-platform sprint', summary: 'One codebase. iOS + Android. Native feel. Fast.', outcome: '-40% TIME TO RELEASE', details: 'Shared business logic with platform-specific UI layers. CI/CD for both stores. Cut cycle time 40%. 99.9% crash-free rate on production.' },
        { title: 'Go microservices on Cloud Run', summary: 'Event-driven architecture that scales horizontally.', outcome: '10X TRAFFIC HANDLED', details: 'RabbitMQ messaging, Docker containers, zero-downtime deployments. Promo traffic went from 5% errors to zero.' },
        { title: 'Sub-200ms checkout funnel', summary: 'React frontend + FastAPI backend. Optimized queries.', outcome: '+18% CHECKOUT COMPLETION', details: 'Indexed queries, async I/O, response caching. p95 dropped from 600ms to 184ms. Conversion followed.' },
        { title: 'AI features that ship', summary: 'RAG pipelines, agent workflows, vector search.', outcome: 'LIVE IN PRODUCTION', details: 'Use-case mapping tied to retention. Agent workflows + vector DB plan. Security & eval checklist included.' }
    ];
    const solTitle = $('.solution-title');
    const solSummary = $('.solution-summary');
    const solOutcome = $('.solution-outcome');
    const solDetails = $('.solution-details');

    function updateSolution(index) {
        const s = solutions[index];
        if (!s || !solTitle) return;
        if (!reducedMotion && typeof gsap !== 'undefined') {
            gsap.to([solTitle, solSummary, solOutcome, solDetails], {
                opacity: 0, y: 10, duration: 0.15, onComplete: () => {
                    solTitle.textContent = s.title;
                    if (solSummary) solSummary.textContent = s.summary;
                    if (solOutcome) solOutcome.textContent = s.outcome;
                    if (solDetails) solDetails.textContent = s.details;
                    gsap.to([solTitle, solSummary, solOutcome, solDetails], { opacity: 1, y: 0, duration: 0.25, stagger: 0.04 });
                }
            });
        } else {
            solTitle.textContent = s.title;
            if (solSummary) solSummary.textContent = s.summary;
            if (solOutcome) solOutcome.textContent = s.outcome;
            if (solDetails) solDetails.textContent = s.details;
        }
    }

    problems.forEach((card, idx) => {
        card.addEventListener('click', () => {
            problems.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            updateSolution(idx);
        });
    });

    // ============================================================
    // PAIN PILLS
    // ============================================================
    $$('.pain-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            $$('.pain-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
        });
    });

    // ============================================================
    // FORM
    // ============================================================
    const form = $('#contactForm');
    const success = $('#formSuccess');
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('.form-submit');
        if (btn) { btn.textContent = 'SENDING...'; btn.disabled = true; }
        try {
            const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
            if (res.ok) { form.style.display = 'none'; success?.classList.remove('hidden'); }
            else throw new Error('fail');
        } catch {
            if (btn) { btn.textContent = 'REQUEST_AUDIT →'; btn.disabled = false; }
            alert('Something broke. Email me: bhadrakshbhargava@gmail.com');
        }
    });

    // ============================================================
    // CINEMATIC SCENES
    // ============================================================
    if (!enableCinematic || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        // Simple fade-in for non-cinematic
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

    // Split text helper
    function splitText(el) {
        if (typeof SplitType === 'undefined' || !el) return null;
        return new SplitType(el, { types: 'chars,lines' });
    }

    // Scene builder
    function createScene(triggerEl, endOffset, tl) {
        return ScrollTrigger.create({
            trigger: triggerEl,
            start: 'top top',
            end: '+=' + endOffset,
            pin: true,
            scrub: 0.6,
            animation: tl,
            anticipatePin: 1,
            invalidateOnRefresh: true
        });
    }

    // ---------- HERO (auto-play entrance, not pinned) ----------
    const heroTitle = $('.hero-title');
    const heroSplit = splitText(heroTitle);
    const heroChars = heroSplit?.chars || [];

    // Auto-play entrance on page load
    const heroEntrance = gsap.timeline({ delay: 0.2 });
    heroEntrance.fromTo(heroChars, { opacity: 0, rotateX: -90, z: -400, y: 80 }, { opacity: 1, rotateX: 0, z: 0, y: 0, stagger: 0.02, ease: 'back.out(1.4)', duration: 0.4 }, 0);
    heroEntrance.fromTo('[data-layer="label"]', { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.3 }, 0.15);
    heroEntrance.fromTo('[data-layer="subtitle"]', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.3 }, 0.22);
    heroEntrance.fromTo('[data-layer="ctas"]', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.25 }, 0.3);
    heroEntrance.fromTo('[data-layer="meta"]', { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.38);
    heroEntrance.fromTo('.hero-deco', { opacity: 0, scale: 0.8, rotateZ: -10 }, { opacity: 0.15, scale: 1, rotateZ: 0, duration: 0.6 }, 0.2);

    // Subtle scroll fade-out as user scrolls past
    gsap.fromTo('.hero-scene', { opacity: 1, y: 0 }, {
        opacity: 0,
        y: -60,
        ease: 'power2.in',
        scrollTrigger: { trigger: '.hero-scene', start: '40% top', end: 'bottom top', scrub: 0.5 }
    });

    // ---------- PROBLEMS ----------
    const probTl = gsap.timeline();
    probTl.fromTo('[data-scene="problems"] [data-layer="header"]', { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 0.15 }, 0);
    probTl.fromTo('.problem-card', { opacity: 0, x: -120, rotateY: 30 }, { opacity: 1, x: 0, rotateY: 0, stagger: 0.04, duration: 0.2 }, 0.1);
    probTl.fromTo('.solution-panel', { opacity: 0, x: 120, rotateY: -15 }, { opacity: 1, x: 0, rotateY: 0, duration: 0.2 }, 0.2);
    probTl.to({}, { duration: 0.35 }, 0.45); // settle
    probTl.to('.problems-grid', { opacity: 0, scale: 0.92, y: -40, duration: 0.2 }, 0.75);
    probTl.to('[data-scene="problems"] [data-layer="header"]', { opacity: 0, duration: 0.15 }, 0.78);
    probTl.to('[data-scene="problems"] [data-layer="cta"]', { opacity: 0, duration: 0.1 }, 0.8);
    createScene('.problems-scene', '300%', probTl);

    // ---------- SERVICES ----------
    const svcTl = gsap.timeline();
    const svcCards = $$('.service-card');
    svcTl.fromTo('[data-scene="services"] [data-layer="header"]', { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: 0.15 }, 0);
    svcTl.fromTo(svcCards, { opacity: 0, scale: 0.7, y: 100, rotateX: 25 }, { opacity: 1, scale: 1, y: 0, rotateX: 0, stagger: 0.06, duration: 0.25, ease: 'back.out(1.2)' }, 0.12);
    svcTl.fromTo('.deliverable', { opacity: 0, x: -20 }, { opacity: 1, x: 0, stagger: 0.03, duration: 0.15 }, 0.35);
    svcTl.to({}, { duration: 0.3 }, 0.55); // settle
    svcTl.to(svcCards, { opacity: 0, scale: 1.15, y: -80, stagger: 0.03, duration: 0.2, ease: 'power2.in' }, 0.8);
    createScene('.services-scene', '350%', svcTl);

    // ---------- PROOF ----------
    const proofTl = gsap.timeline();
    const proofCards = $$('.proof-card');
    proofTl.fromTo('[data-scene="proof"] [data-layer="header"]', { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: 0.15 }, 0);
    proofTl.fromTo(proofCards, { opacity: 0, y: 120, rotateX: 20 }, { opacity: 1, y: 0, rotateX: 0, stagger: 0.07, duration: 0.25, ease: 'power3.out' }, 0.12);
    proofTl.fromTo('.tech-tag', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, stagger: 0.02, duration: 0.12 }, 0.4);
    proofTl.to({}, { duration: 0.3 }, 0.55);
    proofTl.to(proofCards, { opacity: 0, x: -60, stagger: 0.04, duration: 0.2 }, 0.8);
    createScene('.proof-scene', '300%', proofTl);

    // ---------- OUTCOMES ----------
    const outTl = gsap.timeline();
    const outCards = $$('.outcome-card');
    outTl.fromTo('[data-scene="outcomes"] [data-layer="header"]', { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: 0.15 }, 0);
    outTl.fromTo(outCards, { opacity: 0, scale: 0.5, y: 60 }, { opacity: 1, scale: 1, y: 0, stagger: 0.06, duration: 0.25, ease: 'elastic.out(1, 0.6)' }, 0.15);
    outTl.to('.outcome-fill', { width: (i, el) => el.getAttribute('data-width') + '%', duration: 0.3, stagger: 0.06, ease: 'power2.out' }, 0.35);
    outTl.to({}, { duration: 0.3 }, 0.6);
    outTl.to(outCards, { opacity: 0, y: -40, stagger: 0.03, duration: 0.2 }, 0.82);
    createScene('.outcomes-scene', '250%', outTl);

    // ---------- PROCESS ----------
    const procTl = gsap.timeline();
    const procSteps = $$('.process-step');
    procTl.fromTo('[data-scene="process"] [data-layer="header"]', { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: 0.15 }, 0);
    procTl.fromTo('.timeline-line', { scaleX: 0 }, { scaleX: 1, duration: 0.25, transformOrigin: 'left center' }, 0.1);
    // animate steps sequentially
    procSteps.forEach((step, i) => {
        procTl.fromTo(step, { opacity: 0, y: 30, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.15, ease: 'back.out(1.4)' }, 0.18 + i * 0.1);
    });
    procTl.to({}, { duration: 0.25 }, 0.6);
    procTl.to(procSteps, { opacity: 0, y: -20, stagger: 0.03, duration: 0.15 }, 0.82);
    createScene('.process-scene', '300%', procTl);

    // ---------- CONTACT (not pinned — form needs natural scroll) ----------
    const contactSection = $('.contact-scene');
    if (contactSection) {
        gsap.fromTo('[data-scene="contact"] [data-layer="header"]', { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: contactSection, start: 'top 80%' } });
        gsap.fromTo('.contact-form', { opacity: 0, rotateX: 12, y: 60, transformOrigin: 'center top' }, { opacity: 1, rotateX: 0, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: '.contact-form', start: 'top 85%' } });
        gsap.fromTo('.form-group', { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power2.out', scrollTrigger: { trigger: '.contact-form', start: 'top 80%' } });
        gsap.fromTo('.pain-pill', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, stagger: 0.05, duration: 0.3, ease: 'back.out(1.4)', scrollTrigger: { trigger: '.pain-pills', start: 'top 90%' } });
    }
})();
