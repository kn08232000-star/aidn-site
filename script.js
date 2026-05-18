/* =========================================================
   Jayden — interactivity layer
   ========================================================= */
(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Typewriter ---------- */
  const typeEl = document.getElementById('type');
  if (typeEl && !prefersReduced) {
    const words = ['Shopify stores.', 'landing pages.', 'redesigns.', 'modern UIs.', 'fast sites.'];
    let w = 0, c = 0, deleting = false;
    const tick = () => {
      const word = words[w];
      typeEl.textContent = word.slice(0, c);
      if (!deleting && c < word.length) { c++; setTimeout(tick, 75); }
      else if (deleting && c > 0) { c--; setTimeout(tick, 40); }
      else {
        if (!deleting) { deleting = true; setTimeout(tick, 1400); }
        else { deleting = false; w = (w + 1) % words.length; setTimeout(tick, 250); }
      }
    };
    tick();
  } else if (typeEl) {
    typeEl.textContent = 'Shopify stores.';
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }

  /* ---------- Custom cursor ---------- */
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursor-dot');
  const spotlight = document.querySelector('.spotlight');

  if (isFinePointer && cursor && cursorDot) {
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let cx = mx, cy = my;

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      cursorDot.style.transform = `translate(${mx - 2.5}px, ${my - 2.5}px)`;
      cursor.style.opacity = '1';
      cursorDot.style.opacity = '1';
      if (spotlight) {
        spotlight.style.transform = `translate(${mx - 300}px, ${my - 300}px)`;
        spotlight.style.opacity = '1';
      }
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      cursorDot.style.opacity = '0';
      if (spotlight) spotlight.style.opacity = '0';
    });

    const render = () => {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cursor.style.transform = `translate(${cx - 18}px, ${cy - 18}px)`;
      requestAnimationFrame(render);
    };
    render();

    // Hover targets
    const hoverables = document.querySelectorAll('a, button, [data-magnetic], .card, .show-item');
    hoverables.forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (isFinePointer && !prefersReduced) {
    const magnets = document.querySelectorAll('[data-magnetic]');
    magnets.forEach((m) => {
      let raf;
      m.addEventListener('mousemove', (e) => {
        const r = m.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          m.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
        });
      });
      m.addEventListener('mouseleave', () => {
        cancelAnimationFrame(raf);
        m.style.transform = '';
      });
    });
  }

  /* ---------- Card spotlight (tracks mouse position) ---------- */
  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  /* ---------- 3D tilt on .tilt cards ---------- */
  if (isFinePointer && !prefersReduced) {
    document.querySelectorAll('.tilt').forEach((el) => {
      let raf;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.transform = `perspective(900px) rotateX(${-y * 6}deg) rotateY(${x * 8}deg) translateY(-2px)`;
        });
      });
      el.addEventListener('mouseleave', () => {
        cancelAnimationFrame(raf);
        el.style.transform = '';
      });
    });
  }

  /* ---------- Copy email button ---------- */
  const copyBtn = document.getElementById('copy-email');
  const copyLabel = document.getElementById('copy-label');
  if (copyBtn && copyLabel) {
    copyBtn.addEventListener('click', async () => {
      const email = 'info@aidn.site';
      try {
        await navigator.clipboard.writeText(email);
        copyLabel.textContent = 'Copied!';
      } catch {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = email;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); copyLabel.textContent = 'Copied!'; }
        catch { copyLabel.textContent = 'Press ⌘C'; }
        document.body.removeChild(ta);
      }
      setTimeout(() => { copyLabel.textContent = 'Copy email'; }, 1800);
    });
  }

  /* ---------- Animated dot-grid canvas ---------- */
  const canvas = document.getElementById('bg-canvas');
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext('2d');
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    let mouseX = -9999, mouseY = -9999;
    const spacing = 36;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });
    window.addEventListener('mouseleave', () => { mouseX = -9999; mouseY = -9999; });

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      t += 0.008;

      const cols = Math.ceil(w / spacing) + 1;
      const rows = Math.ceil(h / spacing) + 1;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing;
          const y = j * spacing;
          const dx = x - mouseX;
          const dy = y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const wave = Math.sin((x + y) * 0.02 + t) * 0.5 + 0.5;
          const near = Math.max(0, 1 - dist / 180);

          const r = 0.6 + near * 1.8 + wave * 0.4;
          const a = 0.10 + near * 0.55 + wave * 0.05;

          // Color shift: mint → purple → pink based on near + wave
          let cr, cg, cb;
          if (near > 0.05) {
            // Blend pink/purple near cursor
            cr = 255; cg = 77 + (192 - 77) * (1 - near); cb = 141 + (252 - 141) * (1 - near);
          } else {
            // mint baseline
            cr = 0; cg = 255; cb = 209;
          }

          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${cr|0}, ${cg|0}, ${cb|0}, ${a})`;
          ctx.fill();
        }
      }
      requestAnimationFrame(draw);
    };
    draw();
  }

  /* ---------- Smooth-scroll offset for fixed nav ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.scrollY - 12;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });
})();
