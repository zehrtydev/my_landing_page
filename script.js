// ==== GESTIÓN DEL TEMA Y ESTADO ====
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;
    let particleColor = "rgba(124, 58, 237, 0.35)";

    function setTheme(theme) {
      root.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);

      // Usar innerHTML evita el fallo clásico donde FontAwesome convierte el <i>
      // nativo a un <svg> que ya no responde a themeIcon.className
      if (theme === 'dark') {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
      }

      // Tomar las nuevas variables de background al pasarse
      setTimeout(() => {
        particleColor = getComputedStyle(root).getPropertyValue('--particle-color').trim() || particleColor;
      }, 50);
    }

    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      setTheme(savedTheme);
    } else if (systemPrefersDark) {
      setTheme('dark');
    } else {
      setTheme('light');
    }

    themeToggle.addEventListener('click', () => {
      setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });

    // ==== INTERSECTION OBSERVER ANIMACIONES CLARAS ====
    const fadeElements = document.querySelectorAll('.fade-up');
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.nav-links a');

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { rootMargin: '0px 0px -100px 0px', threshold: 0.1 });

    fadeElements.forEach(el => revealObserver.observe(el));

    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active-link');
            }
          });
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

    sections.forEach(sec => navObserver.observe(sec));


    // ==== TIMELINE ENGINE ====
    const timelineContainer = document.getElementById("timeline-container");
    const timelineProgress = document.getElementById("timeline-progress");
    const timelineItems = document.querySelectorAll(".timeline-item");

    window.addEventListener("scroll", () => {
      if (timelineContainer && timelineItems.length > 0) {

        const rect = timelineContainer.getBoundingClientRect();
        const centerScreen = window.innerHeight / 2;

        let progressHeight = centerScreen - rect.top;
        progressHeight = Math.max(0, Math.min(progressHeight, rect.height));
        timelineProgress.style.height = `${progressHeight}px`;

        timelineItems.forEach(item => item.classList.remove("active"));

        for (let i = timelineItems.length - 1; i >= 0; i--) {
          const itemRect = timelineItems[i].getBoundingClientRect();
          const triggerZone = itemRect.top + 33; // Centro del ícono matemático en la tarjeta

          if (centerScreen >= triggerZone) {
            timelineItems[i].classList.add("active");
            break;
          }
        }
      }
    });

    window.dispatchEvent(new Event('scroll'));

    // ==== PARTÍCULAS BACKGROUND SUTILES ====
    const canvas = document.getElementById("particles");
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    let particles = [];
    for (let i = 0; i < 70; i++) { // Devuelto a un valor disfrutable y mágico
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2,
        dx: Math.random() * 0.4,
        dy: Math.random() * 0.4
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        if (p.x > canvas.width || p.x < 0) p.dx *= -1;
        if (p.y > canvas.height || p.y < 0) p.dy *= -1;
      });
      requestAnimationFrame(draw);
    }
    draw();

    // ==== FORMULARIO ASÍNCRONO ====
    const form = document.querySelector("#contacto form");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      try {
        await fetch(form.action, { method: "POST", body: data });
        const message = document.getElementById("form-message");
        message.style.display = "block";
        setTimeout(() => message.style.display = "none", 4000);
        form.reset();
      } catch (error) {
        alert("Error al enviar ❌");
      }
    });

    // ==== EFECTO PARALLAX AVANZADO Y FADE-OUT HERO (Multi-Layer) ====
    const heroSection = document.getElementById('inicio');
    const heroProfile = document.querySelector('#inicio .profile');
    const heroTitle = document.querySelector('#inicio h1');
    const heroSubtitle = document.querySelector('#inicio .subtitle');
    const heroBtns = document.querySelector('#inicio .hero-buttons');
    let isTicking = false;

    window.addEventListener('scroll', () => {
      if (!heroSection) return;

      // Control de rendimiento estricto con requestAnimationFrame (evita lags y cálculos pesados en scroll)
      if (!isTicking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;

          if (scrollY <= window.innerHeight) {
            // Curva de opacidad que empieza a caer progresivamente más rápido (Efecto suave profesional)
            const ratio = Math.min(scrollY, 600) / 600;
            const fadeVal = Math.pow(1 - ratio, 1.8);

            // Cada componente viaja hacia arriba a su propia velocidad hipermarcada
            if (heroProfile) {
              heroProfile.style.transform = `translateY(-${scrollY * 0.2}px)`; // Lento
              heroProfile.style.opacity = fadeVal;
            }
            if (heroTitle) {
              heroTitle.style.transform = `translateY(-${scrollY * 0.45}px)`; // Medio
              heroTitle.style.opacity = fadeVal;
            }
            if (heroSubtitle) {
              heroSubtitle.style.transform = `translateY(-${scrollY * 0.65}px)`; // Medio-rápido
              heroSubtitle.style.opacity = fadeVal;
            }
            if (heroBtns) {
              heroBtns.style.transform = `translateY(-${scrollY * 0.9}px)`; // Rápido
              heroBtns.style.opacity = fadeVal;
            }
          }
          isTicking = false;
        });
        isTicking = true;
      }
    });

    history.scrollRestoration = "manual";
