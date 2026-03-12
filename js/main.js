/* ============================================
   SWABIR M. BWANA — Portfolio JS
   ============================================ */

// ---- PARTICLE CANVAS ----
(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles;

  const config = {
    count: 70,
    maxDist: 120,
    speed: 0.35,
    radius: 1.8,
    color: '220, 38, 38',
    lineAlpha: 0.12,
  };

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = Array.from({ length: config.count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * config.speed * 2,
      vy: (Math.random() - 0.5) * config.speed * 2,
      r: Math.random() * config.radius + 0.5,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${config.color}, 0.5)`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < config.maxDist) {
          const alpha = config.lineAlpha * (1 - dist / config.maxDist);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${config.color}, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  resize();
  createParticles();
  draw();
})();

// ---- TYPING ANIMATION ----
(function () {
  const el = document.querySelector('.hero-typing');
  if (!el) return;

  const phrases = [
    'Engineering Sciences @ Dartmouth',
    'Full-Stack Developer',
    'Embedded Systems Engineer',
    'Bioelectronics Researcher',
    'CS Teaching Assistant',
  ];

  let phraseIdx = 0, charIdx = 0, deleting = false;
  const typeSpeed = 70, deleteSpeed = 40, pauseMs = 2200;

  function type() {
    const current = phrases[phraseIdx];
    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, pauseMs);
        return;
      }
      setTimeout(type, typeSpeed);
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
      setTimeout(type, deleteSpeed);
    }
  }

  setTimeout(type, 1000);
})();

// ---- SCROLL REVEAL ----
(function () {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  els.forEach((el) => obs.observe(el));
})();

// ---- NAVBAR SCROLL ----
(function () {
  const nav = document.querySelector('nav');
  const links = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = [...links].map((l) => document.querySelector(l.getAttribute('href'))).filter(Boolean);

  function onScroll() {
    if (window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');

    // active link
    let current = '';
    sections.forEach((sec) => {
      if (window.scrollY >= sec.offsetTop - 120) current = '#' + sec.id;
    });
    links.forEach((l) => {
      l.classList.toggle('active', l.getAttribute('href') === current);
    });

    // back to top
    const btn = document.querySelector('.back-to-top');
    if (btn) btn.classList.toggle('visible', window.scrollY > 400);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ---- SMOOTH SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      // close mobile menu if open
      document.querySelector('.mobile-nav')?.classList.remove('open');
      document.querySelector('.overlay')?.classList.remove('open');
      document.querySelector('.hamburger')?.classList.remove('open');
    }
  });
});

// ---- HAMBURGER / MOBILE MENU ----
(function () {
  const ham = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const overlay = document.querySelector('.overlay');
  if (!ham) return;

  ham.addEventListener('click', () => {
    const open = ham.classList.toggle('open');
    mobileNav.classList.toggle('open', open);
    overlay.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  overlay.addEventListener('click', () => {
    ham.classList.remove('open');
    mobileNav.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  });
})();

// ---- BACK TO TOP ----
document.querySelector('.back-to-top')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---- PROJECT FILTER ----
(function () {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      btns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      cards.forEach((card) => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.opacity = match ? '1' : '0.2';
        card.style.transform = match ? '' : 'scale(0.96)';
        card.style.pointerEvents = match ? '' : 'none';
      });
    });
  });
})();

// ---- COUNTER ANIMATION ----
(function () {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const duration = 1500;
        const start = performance.now();
        obs.unobserve(el);

        function update(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = prefix + Math.round(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((c) => obs.observe(c));
})();

// ---- CURSOR GLOW (subtle mouse effect) ----
(function () {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle, rgba(220,38,38,0.04) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;
    top: 0; left: 0;
  `;
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
})();
