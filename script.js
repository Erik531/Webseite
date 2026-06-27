/* ============================================================
   KNX Consulting Jeschke – main script
============================================================ */

// ─── Navbar scroll shadow ─────────────────────────────────
(function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    function onScroll() {
        navbar.classList.toggle('scrolled', window.scrollY > 10);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
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

// ─── Contact form → Formspree ─────────────────────────────
(function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();

        const btn = form.querySelector('button[type="submit"]');
        const original = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<span style="opacity:.6">Wird gesendet…</span>';

        try {
            const res = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (res.ok) {
                form.innerHTML = `
                    <div style="text-align:center;padding:2rem 0">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:1rem"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        <p style="font-size:1.1rem;font-weight:600;margin-bottom:.5rem">Nachricht gesendet!</p>
                        <p style="opacity:.7">Vielen Dank – ich melde mich so schnell wie möglich bei Ihnen.</p>
                    </div>`;
            } else {
                const data = await res.json();
                throw new Error(data?.errors?.[0]?.message || 'Unbekannter Fehler');
            }
        } catch (err) {
            btn.disabled = false;
            btn.innerHTML = original;
            const hint = form.querySelector('.form-hint');
            let errEl = form.querySelector('.form-error');
            if (!errEl) {
                errEl = document.createElement('p');
                errEl.className = 'form-error';
                errEl.style.cssText = 'color:#f87171;margin-top:.5rem;font-size:.9rem';
                hint ? hint.before(errEl) : form.append(errEl);
            }
            errEl.textContent = `Fehler beim Senden: ${err.message}. Bitte versuchen Sie es erneut oder schreiben Sie direkt an jeschke.erik@outlook.de.`;
        }
    });
})();

// ─── Footer year ──────────────────────────────────────────
(function setYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
})();
