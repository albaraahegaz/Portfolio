/**
 * ════════════════════════════════════════════════════════════════
 * AL-BARAA HEGAZ — PORTFOLIO CLIENT ENGINE
 * Pure Vanilla JavaScript (ES6+)
 * ════════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────
     1. THEME MANAGEMENT (Dark / Light with LocalStorage)
     ───────────────────────────────────────────────────────────── */
  const themeToggle = document.getElementById('themeToggle');
  const htmlElement = document.documentElement;

  // Retrieve saved preference or default to dark
  const savedTheme = localStorage.getItem('albaraa_theme') || 'dark';
  htmlElement.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('albaraa_theme', newTheme);
      
      // Update canvas particle colors
      if (window.updateCanvasColors) {
        window.updateCanvasColors(newTheme);
      }
    });
  }

  /* ─────────────────────────────────────────────────────────────
     2. MOUSE-FOLLOWING AMBIENT SPOTLIGHT
     ───────────────────────────────────────────────────────────── */
  const spotlight = document.getElementById('ambientSpotlight');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;
  let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouchDevice && spotlight) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function renderSpotlight() {
      // Smooth interpolation for luxury feel
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;

      document.documentElement.style.setProperty('--mouse-x', `${currentX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${currentY}px`);

      requestAnimationFrame(renderSpotlight);
    }
    requestAnimationFrame(renderSpotlight);
  }

  /* ─────────────────────────────────────────────────────────────
     3. INTERACTIVE NEURAL & CIRCUIT CANVAS BACKGROUND
     ───────────────────────────────────────────────────────────── */
  const canvas = document.getElementById('neuralCanvas');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let particles = [];
    const particleCount = window.innerWidth < 768 ? 42 : 78;
    const maxDistance = 145;
    let canvasMouseX = null;
    let canvasMouseY = null;
    let isCanvasActive = true;

    // Mathematical symbols to subtly float in the matrix
    const mathSymbols = ['∇', 'Σ', '∫', 'σ', 'λ', 'θ', '∂y/∂x', 'Wᵀx', 'L(θ)'];
    let floatingSymbols = [];

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', debounce(resizeCanvas, 150));
    resizeCanvas();

    // Track mouse on canvas
    window.addEventListener('mousemove', (e) => {
      canvasMouseX = e.clientX;
      canvasMouseY = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      canvasMouseX = null;
      canvasMouseY = null;
    });

    // Particle Object
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.75;
        this.vy = (Math.random() - 0.5) * 0.75;
        this.radius = Math.random() * 1.8 + 1.2;
        // ~15% crimson nodes, remainder warm gold
        this.isCrimson = Math.random() < 0.15;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off canvas bounds
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction: gentle repulsion / attraction
        if (canvasMouseX !== null && canvasMouseY !== null) {
          const dx = canvasMouseX - this.x;
          const dy = canvasMouseY - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const mouseRadius = 170;

          if (dist < mouseRadius && dist > 0) {
            const force = (mouseRadius - dist) / mouseRadius;
            // Subtle displacement
            this.x -= (dx / dist) * force * 1.8;
            this.y -= (dy / dist) * force * 1.8;
          }
        }
      }

      draw(isLight) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        if (this.isCrimson) {
          ctx.fillStyle = isLight ? 'rgba(193, 18, 31, 0.75)' : 'rgba(230, 57, 70, 0.85)';
        } else {
          ctx.fillStyle = isLight ? 'rgba(179, 134, 18, 0.65)' : 'rgba(212, 175, 55, 0.75)';
        }
        ctx.fill();
      }
    }

    // Floating Math Symbol
    class MathGlyph {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vy = -(Math.random() * 0.3 + 0.1);
        this.symbol = mathSymbols[Math.floor(Math.random() * mathSymbols.length)];
        this.opacity = Math.random() * 0.2 + 0.08;
      }

      update() {
        this.y += this.vy;
        if (this.y < -20) {
          this.y = height + 20;
          this.x = Math.random() * width;
        }
      }

      draw(isLight) {
        ctx.font = '12px "JetBrains Mono", monospace';
        ctx.fillStyle = isLight
          ? `rgba(179, 134, 18, ${this.opacity * 0.6})`
          : `rgba(212, 175, 55, ${this.opacity})`;
        ctx.fillText(this.symbol, this.x, this.y);
      }
    }

    // Initialize particles & glyphs
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    const glyphCount = 8;
    for (let i = 0; i < glyphCount; i++) {
      floatingSymbols.push(new MathGlyph());
    }

    // Keep canvas continuously active across the whole page (no scroll cutoffs)
    isCanvasActive = true;

    // Conserve performance only when the browser tab is hidden or minimized
    document.addEventListener('visibilitychange', () => {
      isCanvasActive = !document.hidden;
    });

    // Animation Loop
    function animateCanvas() {
      if (isCanvasActive) {
        ctx.clearRect(0, 0, width, height);
        const isLight = htmlElement.getAttribute('data-theme') === 'light';

        // 1. Draw floating glyphs
        floatingSymbols.forEach(glyph => {
          glyph.update();
          glyph.draw(isLight);
        });

        // 2. Connect nearby particles
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxDistance) {
              const alpha = (1 - dist / maxDistance) * (isLight ? 0.28 : 0.32);
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);

              if (particles[i].isCrimson || particles[j].isCrimson) {
                ctx.strokeStyle = isLight
                  ? `rgba(193, 18, 31, ${alpha * 0.8})`
                  : `rgba(230, 57, 70, ${alpha * 0.95})`;
              } else {
                ctx.strokeStyle = isLight
                  ? `rgba(179, 134, 18, ${alpha})`
                  : `rgba(212, 175, 55, ${alpha})`;
              }
              ctx.lineWidth = 0.9;
              ctx.stroke();
            }
          }

          // Connect particle to cursor if near (across entire page)
          if (canvasMouseX !== null && canvasMouseY !== null) {
            const mdx = particles[i].x - canvasMouseX;
            const mdy = particles[i].y - canvasMouseY;
            const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
            const mouseConnectDist = 165;
            if (mdist < mouseConnectDist) {
              const mAlpha = (1 - mdist / mouseConnectDist) * (isLight ? 0.55 : 0.7);
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(canvasMouseX, canvasMouseY);
              ctx.strokeStyle = isLight
                ? `rgba(179, 134, 18, ${mAlpha})`
                : `rgba(212, 175, 55, ${mAlpha})`;
              ctx.lineWidth = 1.25;
              ctx.stroke();
            }
          }

          // Update & draw particles
          particles[i].update();
          particles[i].draw(isLight);
        }
      }
      requestAnimationFrame(animateCanvas);
    }
    requestAnimationFrame(animateCanvas);
  }

  /* ─────────────────────────────────────────────────────────────
     4. 3D TILT EFFECT ON CARDS
     ───────────────────────────────────────────────────────────── */
  if (!isTouchDevice && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const tiltCards = document.querySelectorAll('.tilt-card, .hero-tech-card');

    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Subtle angles (max 6-8 deg for luxury feel)
        const rotateX = ((y - centerY) / centerY) * -7;
        const rotateY = ((x - centerX) / centerX) * 7;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      });

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────
     5. MAGNETIC BUTTONS EFFECT
     ───────────────────────────────────────────────────────────── */
  if (!isTouchDevice && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
        btn.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
      });

      btn.addEventListener('mouseenter', () => {
        btn.style.transition = 'none';
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────
     6. STICKY HEADER & SCROLL-SPY NAVIGATION
     ───────────────────────────────────────────────────────────── */
  const header = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // IntersectionObserver for active section highlight
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');

        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        mobileNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { rootMargin: '-25% 0px -65% 0px' });

  sections.forEach(sec => sectionObserver.observe(sec));

  /* ─────────────────────────────────────────────────────────────
     7. MOBILE HAMBURGER DRAWER
     ───────────────────────────────────────────────────────────── */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close when clicking any nav link
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileDrawer.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        closeMobileMenu();
      }
    });
  }

  function openMobileMenu() {
    mobileMenuBtn.classList.add('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
  }

  function closeMobileMenu() {
    mobileMenuBtn.classList.remove('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
  }

  /* ─────────────────────────────────────────────────────────────
     8. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
     ───────────────────────────────────────────────────────────── */
  const revealElements = document.querySelectorAll('.tilt-card, .timeline-item, .section-header, .ai-learning-strip, .strengths-wrapper, .objective-card');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('scroll-reveal', 'visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    el.classList.add('scroll-reveal');
    revealObserver.observe(el);
  });

  /* ─────────────────────────────────────────────────────────────
     9. ANIMATED NUMBER COUNTERS IN ABOUT SECTION
     ───────────────────────────────────────────────────────────── */
  const statElements = document.querySelectorAll('[data-stat]');
  let statsCounted = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsCounted) {
        statsCounted = true;
        animateStats();
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.about-stats-grid');
  if (statsSection) statsObserver.observe(statsSection);

  function animateStats() {
    // Stat numbers are text-based ("4th", "AI / ML", "Top 5", "16th / 139")
    // We add a subtle highlight pulse
    statElements.forEach((card, index) => {
      setTimeout(() => {
        card.style.boxShadow = '0 0 25px var(--accent-gold-glow)';
        setTimeout(() => {
          card.style.boxShadow = '';
        }, 800);
      }, index * 180);
    });
  }

  /* ─────────────────────────────────────────────────────────────
     10. EXPANDABLE CERTIFICATIONS
     ───────────────────────────────────────────────────────────── */
  const toggleCertsBtn = document.getElementById('toggleCertsBtn');
  const certsExpandable = document.getElementById('certsExpandable');

  if (toggleCertsBtn && certsExpandable) {
    toggleCertsBtn.addEventListener('click', () => {
      const isExpanded = certsExpandable.classList.contains('expanded');
      const toggleText = toggleCertsBtn.querySelector('.btn-toggle-text');

      if (isExpanded) {
        certsExpandable.classList.remove('expanded');
        toggleCertsBtn.setAttribute('aria-expanded', 'false');
        if (toggleText) toggleText.textContent = 'VIEW MORE CERTIFICATIONS';
      } else {
        certsExpandable.classList.add('expanded');
        toggleCertsBtn.setAttribute('aria-expanded', 'true');
        if (toggleText) toggleText.textContent = 'VIEW FEWER CERTIFICATIONS';
      }
    });
  }

  /* ─────────────────────────────────────────────────────────────
     11. PROJECT DETAIL MODALS DATA & ENGINE
     ───────────────────────────────────────────────────────────── */
  const projectDetails = {
    sadeed: {
      category: "CLINICAL AI & RAG ARCHITECTURE",
      title: "Sadeed — AI-Powered Clinical RAG System",
      badge: "Top 5 Finalist — AI Hackathon (Creativa Innovation Hub 2026)",
      summary: "An AI clinical co-pilot developed for oncology information support. Sadeed combines hybrid retrieval using semantic search and BM25 with an agentic RAG workflow built using LangGraph. The system incorporates safety guardrails, source-grounded generation, evaluation, and tracing to improve reliability.",
      architecture: [
        "Hybrid Search Engine: Reciprocal Rank Fusion (RRF) between dense embeddings (Gemini embedding-001) and sparse keyword retrieval (BM25).",
        "Document Parsing: High-fidelity clinical guideline ingestion via LlamaParse, preserving tables, dosages, and hierarchy.",
        "Agentic Graph: StateGraph built with LangGraph orchestrating query classification, retrieval evaluation, self-correction, and safety gating.",
        "Vector Index: Supabase pgvector hosting indexed clinical guidelines.",
        "Evaluation & Telemetry: RAGAS metrics for faithfulness & answer relevancy; end-to-end trace logging via LangSmith."
      ],
      techStack: ["RAG", "LangGraph", "LlamaParse", "Supabase pgvector", "Gemini", "RAGAS", "LangSmith", "FastAPI", "Next.js"],
      repoStatus: "Official prototype developed during Creativa Innovation Hub Menofia AI Hackathon."
    },
    fahman: {
      category: "EDTECH & ARABIC SPEECH/NLP",
      title: "Fahman.ai — Socratic Arabic Reading Tutor",
      badge: "16th of 139 Teams — ImpactX 2026 (Top 12%)",
      summary: "An Arabic reading tutor designed for children aged 6–9. Fahman diagnoses specific reading mistakes such as letter shape, dots, harakat, and blending, then guides the learner using a Socratic hint ladder instead of simply giving the answer.",
      architecture: [
        "Acoustic & Phonetic Ingestion: Speech-to-text alignment using fine-tuned Whisper for child-level Arabic speech pronunciation.",
        "Phoneme & Harakat Analysis: Mishkal diacritization combined with Qari-OCR to capture and compare expected vs. vocalized Arabic syllables.",
        "Socratic Prompt Engine: Nile-Chat-4B model structured to provide incremental pedagogical hints (Level 1: visual cue → Level 2: syllable breakdown → Level 3: phoneme isolation).",
        "Auditory Synthesis: Edge TTS providing responsive, child-friendly feedback prompts.",
        "Serving Layer: FastAPI microservice communicating with Next.js frontend."
      ],
      techStack: ["Nile-Chat-4B", "Qari-OCR", "Whisper", "Mishkal", "Edge TTS", "FastAPI", "Next.js"],
      repoStatus: "ImpactX 2026 Competition Entry — Ranked 16th among 139 teams."
    },
    foodmart: {
      category: "BUSINESS INTELLIGENCE & ANALYTICS",
      title: "Food Mart Sales Analysis — Interactive Power BI Dashboard",
      badge: "Production-Grade BI Dashboard",
      summary: "An interactive business intelligence dashboard analyzing Food Mart sales data through cleaning, exploratory analysis, and KPI-driven visualization.",
      architecture: [
        "Data Hygiene & Pipeline: Automated data cleansing and normalization using Power Query and Python.",
        "Analytical Data Modeling: Star schema dimensional modeling with custom DAX measures for YTD, YoY growth, and return rates.",
        "Core KPI Dashboards: Revenue, Cost, Profit, Profit Margins, Customer Acquisition/Lifetime Value, and Product Return analysis.",
        "Interactive Drilldowns: Multi-level geographic drilldowns and seasonal item purchase trends."
      ],
      techStack: ["Power BI", "DAX", "EDA", "Data Analysis", "Data Visualization", "Microsoft Excel"],
      repoStatus: "BI Showcase Project with comprehensive exploratory analysis."
    },
    roadhero: {
      category: "PRODUCT STRATEGY & ENTREPRENEURSHIP",
      title: "RoadHero — Emergency Assistance Application Concept",
      badge: "Entrepreneurial Concept & MVP",
      summary: "An Uber-style emergency assistance application concept designed to help people who are stuck on the road quickly find appropriate help. Developed from idea through business concept, pitch, and prototype.",
      architecture: [
        "Problem Discovery: High-friction roadside emergency dispatch in metropolitan and highway zones.",
        "Solution Architecture: On-demand geolocation matchmaking between stranded drivers and nearest verified towing/repair technicians.",
        "Business Modeling: Unit economics, partner dispatch tiering, and emergency response SLA framework.",
        "MVP Prototype: Wireframes, flowcharts, and technical requirement specifications for scalable deployment."
      ],
      techStack: ["Product Strategy", "Entrepreneurship", "MVP", "Business Modeling"],
      repoStatus: "Business Case & Prototype Concept."
    }
  };

  const projectModal = document.getElementById('projectModal');
  const modalContent = document.getElementById('modalContent');

  window.openProjectModal = function (projectId) {
    const data = projectDetails[projectId];
    if (!data || !projectModal || !modalContent) return;

    modalContent.innerHTML = `
      <div class="modal-header-strip">
        <span class="modal-kicker">${data.category}</span>
        <h3 id="modalTitle" class="modal-main-title">${data.title}</h3>
      </div>
      <div class="project-badge gold-badge" style="margin-bottom: 20px;">
        <span>&starf;</span> ${data.badge}
      </div>
      <p style="font-size: 0.98rem; line-height: 1.7; color: var(--text-secondary); margin-bottom: 24px;">
        ${data.summary}
      </p>
      
      <h4 style="font-family: var(--font-heading); font-size: 1.1rem; color: var(--accent-gold); margin-bottom: 12px;">
        System Architecture &amp; Methodology
      </h4>
      <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 26px;">
        ${data.architecture.map(item => `
          <li style="font-size: 0.9rem; line-height: 1.6; color: var(--text-secondary); display: flex; align-items: flex-start; gap: 10px;">
            <span style="color: var(--accent-gold); font-weight: bold; margin-top: 1px;">&rarr;</span>
            <span>${item}</span>
          </li>
        `).join('')}
      </ul>

      <h4 style="font-family: var(--font-heading); font-size: 1.1rem; color: var(--accent-gold); margin-bottom: 12px;">
        Technologies Used
      </h4>
      <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px;">
        ${data.techStack.map(tech => `
          <span class="tech-pill" style="color: var(--text-primary); border-color: var(--gold-border); background: rgba(212, 175, 55, 0.08);">
            ${tech}
          </span>
        `).join('')}
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 20px; flex-wrap: wrap; gap: 12px;">
        <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted);">
          Status: ${data.repoStatus}
        </span>
        <button class="btn btn-secondary" onclick="closeProjectModal()" style="padding: 8px 18px;">
          Close Details
        </button>
      </div>
    `;

    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  window.closeProjectModal = function () {
    if (!projectModal) return;
    projectModal.classList.remove('active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  /* ─────────────────────────────────────────────────────────────
     12. CURRICULUM VITAE MODAL
     ───────────────────────────────────────────────────────────── */
  const cvModal = document.getElementById('cvModal');
  const downloadCvBtn = document.getElementById('downloadCvBtn');

  if (downloadCvBtn && cvModal) {
    downloadCvBtn.addEventListener('click', () => {
      cvModal.classList.add('active');
      cvModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  }

  window.closeCvModal = function () {
    if (!cvModal) return;
    cvModal.classList.remove('active');
    cvModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
      closeCvModal();
    }
  });

  /* ─────────────────────────────────────────────────────────────
     13. PLACEHOLDER LINK NOTIFICATION TOAST
     ───────────────────────────────────────────────────────────── */
  const placeholderToast = document.getElementById('placeholderToast');
  const placeholderText = document.getElementById('placeholderText');
  let toastTimeout = null;

  window.handlePlaceholderClick = function (e, resourceName) {
    e.preventDefault();
    if (!placeholderToast || !placeholderText) return;

    placeholderText.textContent = `${resourceName} is currently in progress / available upon direct request.`;
    placeholderToast.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      placeholderToast.classList.remove('show');
    }, 3500);
  };

  /* ─────────────────────────────────────────────────────────────
     14. CLIENT-SIDE CONTACT FORM SUBMISSION
     ───────────────────────────────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('form-status');

  if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btnText = submitBtn.querySelector('.btn-text');
      const originalText = btnText ? btnText.textContent : submitBtn.textContent;

      submitBtn.disabled = true;
      if (btnText) {
        btnText.textContent = 'Sending...';
      } else {
        submitBtn.textContent = 'Sending...';
      }

      if (formStatus) {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
      }

      const name = (contactForm.elements['name']?.value || contactForm.querySelector('[name="name"]')?.value || '').trim();
      const email = (contactForm.elements['email']?.value || contactForm.querySelector('[name="email"]')?.value || '').trim();
      const message = (contactForm.elements['message']?.value || contactForm.querySelector('[name="message"]')?.value || '').trim();
      const website = (contactForm.elements['website']?.value || contactForm.querySelector('[name="website"]')?.value || '');

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, message, website })
        });

        const data = await response.json().catch(() => null);

        if (response.ok && data && data.ok) {
          if (formStatus) {
            formStatus.textContent = 'Thank you! Your message has been sent successfully.';
            formStatus.className = 'form-status success';
          }
          contactForm.reset();
        } else {
          const errorMessage = (data && data.error) ? data.error : 'Failed to send message. Please try again.';
          if (formStatus) {
            formStatus.textContent = errorMessage;
            formStatus.className = 'form-status error';
          }
        }
      } catch (error) {
        if (formStatus) {
          formStatus.textContent = 'Network error. Please check your connection and try again.';
          formStatus.className = 'form-status error';
        }
      } finally {
        submitBtn.disabled = false;
        if (btnText) {
          btnText.textContent = originalText;
        } else {
          submitBtn.textContent = originalText;
        }
      }
    });
  }

  /* ─────────────────────────────────────────────────────────────
     15. BACK TO TOP BUTTON
     ───────────────────────────────────────────────────────────── */
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────
     16. UTILITY: DEBOUNCE
     ───────────────────────────────────────────────────────────── */
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  /* ─────────────────────────────────────────────────────────────
     17. PROJECT IMAGE GALLERY SWITCHER
     ───────────────────────────────────────────────────────────── */
  window.switchGalleryImg = function (dotBtn, imgIndex) {
    const gallery = dotBtn.closest('.project-image-gallery');
    if (!gallery) return;
    const imgs = gallery.querySelectorAll('.project-gallery-img');
    const dots = gallery.querySelectorAll('.gallery-dot');
    imgs.forEach((img, i) => {
      img.classList.toggle('active', i === imgIndex);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === imgIndex);
    });
  };

  /* ─────────────────────────────────────────────────────────────
     18. IMAGE LIGHTBOX MODAL
     ───────────────────────────────────────────────────────────── */
  const lightboxModal = document.getElementById('imageLightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');

  window.openImageLightbox = function (src, caption) {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = caption || 'Preview';
    if (lightboxCaption) {
      lightboxCaption.textContent = caption || '';
      lightboxCaption.style.display = caption ? 'block' : 'none';
    }
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  window.closeImageLightbox = function () {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Close lightbox on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
      window.closeImageLightbox();
    }
  });

  // Attach lightbox click handlers to all cert-thumbnails, timeline-photos, and project gallery images
  function initImageLightboxes() {
    // Certificate thumbnails
    document.querySelectorAll('.cert-thumbnail').forEach(img => {
      img.addEventListener('click', () => {
        const card = img.closest('.cert-card');
        const title = card ? card.querySelector('.cert-title')?.textContent : img.alt;
        window.openImageLightbox(img.src, title || img.alt);
      });
    });

    // Timeline photos
    document.querySelectorAll('.timeline-photo').forEach(img => {
      img.addEventListener('click', () => {
        const item = img.closest('.timeline-item');
        const role = item ? item.querySelector('.timeline-role')?.textContent : '';
        const company = item ? item.querySelector('.timeline-company')?.textContent : '';
        const caption = role && company ? `${role} — ${company}` : img.alt;
        window.openImageLightbox(img.src, caption);
      });
    });

    // Project gallery images
    document.querySelectorAll('.project-gallery-img').forEach(img => {
      img.addEventListener('click', () => {
        const card = img.closest('.project-card');
        const title = card ? card.querySelector('.project-title')?.textContent : '';
        const subtitle = card ? card.querySelector('.project-subtitle')?.textContent : '';
        const caption = title && subtitle ? `${title} — ${subtitle}` : img.alt;
        window.openImageLightbox(img.src, caption);
      });
    });
  }

  initImageLightboxes();

})();
