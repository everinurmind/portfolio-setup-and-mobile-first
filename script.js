// ═══════════════════════════════════════
// CURSOR GLOW (desktop only)
// ═══════════════════════════════════════
const cursorGlow = document.getElementById('cursorGlow');

if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top  = e.clientY + 'px';
        cursorGlow.style.opacity = '1';
    });
    document.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    });
}

// ═══════════════════════════════════════
// MOBILE NAV
// ═══════════════════════════════════════
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

navMenu.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', closeNav);
});

function closeNav() {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

// Close on outside click
document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target)) {
        closeNav();
    }
});

// ═══════════════════════════════════════
// TYPEWRITER
// ═══════════════════════════════════════
const typewriterEl = document.getElementById('typewriter');
const roles = ['Data Analyst', 'SQL Developer', 'BI Developer', 'Python Developer'];
let roleIndex = 0;
let charIndex  = 0;
let isDeleting = false;

function typewrite() {
    const word = roles[roleIndex];

    if (isDeleting) {
        charIndex--;
        typewriterEl.textContent = word.substring(0, charIndex);
    } else {
        charIndex++;
        typewriterEl.textContent = word.substring(0, charIndex);
    }

    let delay = isDeleting ? 45 : 95;

    if (!isDeleting && charIndex === word.length) {
        delay = 2200;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex  = (roleIndex + 1) % roles.length;
        delay = 450;
    }

    setTimeout(typewrite, delay);
}

typewrite();

// ═══════════════════════════════════════
// COUNTER ANIMATION
// ═══════════════════════════════════════
function animateCounters() {
    document.querySelectorAll('.stats__number').forEach((el) => {
        const target   = parseInt(el.dataset.target, 10);
        const duration = 1800;
        let startTime  = null;

        function step(ts) {
            if (!startTime) startTime = ts;
            const progress = Math.min((ts - startTime) / duration, 1);
            const eased    = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target;
        }

        requestAnimationFrame(step);
    });
}

const statsSection = document.querySelector('.stats');
if (statsSection) {
    new IntersectionObserver((entries, obs) => {
        if (entries[0].isIntersecting) {
            animateCounters();
            obs.unobserve(entries[0].target);
        }
    }, { threshold: 0.3 }).observe(statsSection);
}

// ═══════════════════════════════════════
// PROJECT FILTER
// ═══════════════════════════════════════
const filterBtns    = document.querySelectorAll('.filter-btn');
const projectCards  = document.querySelectorAll('.project-card');

filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        projectCards.forEach((card) => {
            const tags = card.dataset.tags || '';
            const show = filter === 'all' || tags.includes(filter);
            card.classList.toggle('filtered-out', !show);

            // Re-trigger fade-in for visible cards
            if (show && !card.classList.contains('visible')) {
                card.classList.add('visible');
            }
        });
    });
});

// ═══════════════════════════════════════
// CODE TABS — SQL / Python
// ═══════════════════════════════════════
const codeTabs = document.querySelectorAll('.code-tab');
const panels   = {
    sql:    document.getElementById('code-sql'),
    python: document.getElementById('code-python'),
};

codeTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        codeTabs.forEach((t) => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const lang = tab.dataset.lang;
        Object.values(panels).forEach((p) => p && p.classList.add('hidden'));
        if (panels[lang]) panels[lang].classList.remove('hidden');

        const output = document.getElementById('codeOutput');
        if (output) output.classList.add('hidden');
    });
});

// ═══════════════════════════════════════
// COPY CODE
// ═══════════════════════════════════════
const copyBtn = document.getElementById('copyBtn');

if (copyBtn) {
    copyBtn.addEventListener('click', () => {
        const visible = document.querySelector('.code-panel:not(.hidden) code');
        if (!visible) return;

        navigator.clipboard.writeText(visible.textContent).then(() => {
            const orig = copyBtn.textContent;
            copyBtn.textContent = 'Copied ✓';
            setTimeout(() => { copyBtn.textContent = orig; }, 2000);
        });
    });
}

// ═══════════════════════════════════════
// RUN CODE (mock output)
// ═══════════════════════════════════════
const runBtn        = document.getElementById('runBtn');
const codeOutput    = document.getElementById('codeOutput');
const codeOutputText = document.getElementById('codeOutputText');

const mockOutputs = {
    sql: `cohort_month | month_index | active_users | retention_rate
-------------|-------------|--------------|---------------
2024-01-01   |      0      |     1 234    |     100.00
2024-01-01   |      1      |       876    |      71.00
2024-01-01   |      2      |       654    |      53.00
2024-02-01   |      0      |     1 456    |     100.00
2024-02-01   |      1      |       987    |      67.79

Query executed in 0.43 s — 4 rows returned`,

    python: `   customer_id  recency  frequency   monetary  rfm_score
0        10 001       12          8   4 521.50        443
1        10 002       45          3     892.00        232
2        10 003        3         15  12 340.80        444
3        10 004      120          1     124.50        111
4        10 005       67          5   2 341.00        323

Champions: 312 customers`,
};

if (runBtn) {
    runBtn.addEventListener('click', () => {
        const lang = document.querySelector('.code-tab.active')?.dataset.lang || 'sql';

        if (codeOutput && codeOutputText) {
            codeOutput.classList.remove('hidden');
            codeOutputText.textContent = '';

            const lines = mockOutputs[lang].split('\n');
            let i = 0;

            function printLine() {
                if (i < lines.length) {
                    codeOutputText.textContent += (i > 0 ? '\n' : '') + lines[i];
                    i++;
                    setTimeout(printLine, 120);
                }
            }

            printLine();
        }
    });
}

// ═══════════════════════════════════════
// FADE-IN ON SCROLL
// ═══════════════════════════════════════
const fadeObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.08 }
);

document.querySelectorAll('.fade-in').forEach((el) => fadeObserver.observe(el));

// ═══════════════════════════════════════
// SCROLL SPY
// ═══════════════════════════════════════
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link[data-section]');

new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach((link) => link.classList.remove('active'));
                const active = document.querySelector(`.nav__link[data-section="${id}"]`);
                if (active) active.classList.add('active');
            }
        });
    },
    { rootMargin: '-48% 0px -48% 0px' }
).observe(document.getElementById('hero'));

sections.forEach((section) => {
    new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach((link) => link.classList.remove('active'));
                    const active = document.querySelector(`.nav__link[data-section="${id}"]`);
                    if (active) active.classList.add('active');
                }
            });
        },
        { rootMargin: '-48% 0px -48% 0px' }
    ).observe(section);
});

// ═══════════════════════════════════════
// CONTACT FORM VALIDATION
// ═══════════════════════════════════════
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name    = document.getElementById('name');
        const email   = document.getElementById('email');
        const message = document.getElementById('message');
        const nameErr = document.getElementById('nameError');
        const emailErr= document.getElementById('emailError');
        const msgErr  = document.getElementById('messageError');
        let valid = true;

        if (name.value.trim().length < 2) {
            nameErr.textContent = 'Please enter your full name (min 2 characters).';
            valid = false;
        } else { nameErr.textContent = ''; }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
            emailErr.textContent = 'Please enter a valid email address.';
            valid = false;
        } else { emailErr.textContent = ''; }

        if (message.value.trim().length < 10) {
            msgErr.textContent = 'Message must be at least 10 characters.';
            valid = false;
        } else { msgErr.textContent = ''; }

        if (valid) {
            const btn = contactForm.querySelector('[type="submit"]');
            btn.textContent = 'Message Sent ✓';
            btn.disabled = true;
            setTimeout(() => {
                contactForm.reset();
                btn.textContent = 'Send Message';
                btn.disabled = false;
            }, 3500);
        }
    });
}
