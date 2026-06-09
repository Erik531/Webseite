/* ============================================================
   KNX Consulting Jeschke – main script
============================================================ */

// ─── Navbar scroll behavior ───────────────────────────────
(function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    function onScroll() {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();

// ─── Mobile menu toggle ───────────────────────────────────
(function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const links  = document.getElementById('navLinks');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        const isOpen = links.classList.toggle('open');
        toggle.classList.toggle('active', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a nav link is clicked
    links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            links.classList.remove('open');
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Close on outside click
    document.addEventListener('click', e => {
        if (!navbar.contains(e.target) && links.classList.contains('open')) {
            links.classList.remove('open');
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
})();

// ─── Scroll-reveal (Intersection Observer) ────────────────
(function initReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach(el => observer.observe(el));
})();

// ─── Active nav link on scroll ────────────────────────────
(function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    link.classList.toggle('active', href === `#${id}`);
                });
            });
        },
        { threshold: 0.4 }
    );

    sections.forEach(s => observer.observe(s));
})();

// ─── Contact form → mailto ────────────────────────────────
(function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();

        const name    = form.querySelector('#name').value.trim();
        const email   = form.querySelector('#email').value.trim();
        const phone   = form.querySelector('#phone').value.trim();
        const message = form.querySelector('#message').value.trim();

        if (!name || !email || !message) return;

        const subjectLine = 'KNX Anfrage über Website';

        const body = [
            `Name: ${name}`,
            `E-Mail: ${email}`,
            phone ? `Telefon: ${phone}` : null,
            '',
            message
        ].filter(line => line !== null).join('\n');

        const mailto = `mailto:jeschke.erik@outlook.de`
            + `?subject=${encodeURIComponent(subjectLine)}`
            + `&body=${encodeURIComponent(body)}`;

        window.location.href = mailto;
    });
})();

// ─── Footer year ──────────────────────────────────────────
(function setYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
})();
