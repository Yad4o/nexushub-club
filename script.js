// ── THEME TOGGLE ─────────────────────────────────────────────────
function toggleTheme() {
  document.body.classList.toggle('light-mode');
  const btn = document.getElementById('themeToggle');
  const isLight = document.body.classList.contains('light-mode');
  if (btn) btn.innerHTML = isLight ? '&#9790;' : '&#9788;';
  localStorage.setItem('nexus-theme', isLight ? 'light' : 'dark');
}
(function initTheme() {
  if (localStorage.getItem('nexus-theme') === 'light') {
    document.body.classList.add('light-mode');
    const btn = document.getElementById('themeToggle');
    if (btn) btn.innerHTML = '&#9790;';
  }
})();

// ── SCROLL PROGRESS ─────────────────────────────────────────────
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
  if (progressBar) progressBar.style.width = `${pct}%`;
});

// ── PARTICLE CANVAS ──────────────────────────────────────────────
const canvas = document.getElementById('particle-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];

  const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.4 + 0.1;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(108,99,255,${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 90; i++) particles.push(new Particle());

  const drawLines = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 130) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(108,99,255,${0.08 * (1 - d / 130)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  };

  const loop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(loop);
  };
  loop();
}

// ── TYPING ANIMATION ─────────────────────────────────────────────
const typingEl = document.getElementById('typing-text');
if (typingEl) {
  const words = ['Innovate.', 'Create.', 'Disrupt.', 'Ship.', 'Build.'];
  let wi = 0, ci = 0, del = false;

  const type = () => {
    const word = words[wi];
    typingEl.textContent = del ? word.slice(0, --ci) : word.slice(0, ++ci);
    if (!del && ci === word.length) { setTimeout(() => { del = true; type(); }, 2200); return; }
    if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; }
    setTimeout(type, del ? 55 : 110);
  };
  type();
}

// ── COUNTER ANIMATION ────────────────────────────────────────────
const statsObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('[data-count]').forEach(el => {
      const target = +el.dataset.count, suffix = el.dataset.suffix || '';
      let n = 0;
      const step = target / 55;
      const t = setInterval(() => {
        n = Math.min(n + step, target);
        el.textContent = Math.floor(n) + suffix;
        if (n >= target) clearInterval(t);
      }, 18);
    });
    statsObs.unobserve(entry.target);
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.hero-stats');
if (statsEl) statsObs.observe(statsEl);

// ── CUSTOM CURSOR ────────────────────────────────────────────────
const cursor = document.getElementById('custom-cursor');
const dot = document.getElementById('cursor-dot');
if (cursor && dot && window.matchMedia('(pointer: fine)').matches) {
  let mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.cssText = `left:${mx}px;top:${my}px`;
  });
  const animCursor = () => {
    cx += (mx - cx) * 0.14; cy += (my - cy) * 0.14;
    cursor.style.cssText = `left:${cx}px;top:${cy}px`;
    requestAnimationFrame(animCursor);
  };
  animCursor();
  document.querySelectorAll('a,button,.card,.event-card,.team-card,.project-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

// ── NAVBAR SCROLL ────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.style.background = window.scrollY > 20 ? 'rgba(10,10,10,0.98)' : 'rgba(10,10,10,0.9)';
});

// ── MOBILE MENU ──────────────────────────────────────────────────
function toggleMenu() {
  document.getElementById('mobileMenu')?.classList.toggle('open');
}

// ── ACTIVE NAV ───────────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 90) cur = s.id; });
  navLinks.forEach(a => a.classList.toggle('nav-active', a.getAttribute('href') === `#${cur}`));
});

// ── SCROLL REVEAL ────────────────────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); revealObs.unobserve(e.target); } });
}, { threshold: 0.08 });

document.querySelectorAll('.card,.event-card,.team-card,.project-card,.achievement-card,.tech-pill,.timeline-item').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 6) * 0.07}s`;
  revealObs.observe(el);
});

// ── SKILL BARS ───────────────────────────────────────────────────
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.skill-fill').forEach(bar => { bar.style.width = bar.dataset.width; });
    skillObs.unobserve(e.target);
  });
}, { threshold: 0.3 });
const techSec = document.querySelector('.tech-section');
if (techSec) skillObs.observe(techSec);

// ── PROJECT FILTER ───────────────────────────────────────────────
function filterProjects(tag, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.project-card').forEach(card => {
    const show = tag === 'all' || card.dataset.tag === tag;
    card.style.display = show ? '' : 'none';
    if (show) { card.classList.remove('revealed'); setTimeout(() => card.classList.add('revealed'), 40); }
  });
}

// ── CONTACT FORM ─────────────────────────────────────────────────
function handleSubmit(e) {
  e.preventDefault();
  document.querySelector('.contact-form').style.display = 'none';
  document.getElementById('form-success').style.display = 'block';
}

// ── NEWSLETTER ───────────────────────────────────────────────────
function handleNewsletter(e) {
  e.preventDefault();
  e.target.innerHTML = '<p style="color:#4ade80;font-size:15px;padding:12px 0">✅ You\'re subscribed!</p>';
}
