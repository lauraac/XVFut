const CONFIG = {
  // ===== CAMBIA ESTOS DATOS =====
  quinceName: 'Yareli Mayte', // nombre temporal
  eventDate: '2026-10-31T17:00:00',
  displayDate: 'Sábado 28 de Noviembre de 2026',
  displayTime: '5:00 p. m.',
  churchName: 'Calle Cuco Sánchez Mz 145 LT 12, Col. Ampliación Emiliano Zapata',
  churchTime: '5:00 p. m.',
  churchMaps: 'https://www.google.com/maps',
  venueName: 'Calle Minos Mz 104 LT 09, San Miguel Teotongo',
  venueTime: '7:00 p. m.',
  venueMaps: 'https://www.google.com/maps',
  whatsapp: '' // Ejemplo México: 5219991234567
};

let slideIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  applyConfig();
  initIntro();
  initMusic();
  initCountdown();
  initCarousel();
  initReveal();
  initRSVP();
  initSparkles();
  initPhotoLightbox();
  initCustomSparkles();
});

function applyConfig() {
  const values = {
    introName: CONFIG.quinceName,
    heroName: CONFIG.quinceName,
    finalName: `${CONFIG.quinceName} · Mis XV años`,
    heroDate: CONFIG.displayDate,
    heroTime: CONFIG.displayTime,
    countdownDate: `${CONFIG.displayDate} · ${CONFIG.displayTime}`,
    churchName: CONFIG.churchName,
    churchTime: CONFIG.churchTime,
    venueName: CONFIG.venueName,
    venueTime: CONFIG.venueTime
  };
  Object.entries(values).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  });
  const churchMaps = document.getElementById('churchMaps');
  const venueMaps = document.getElementById('venueMaps');
  if (churchMaps) churchMaps.href = CONFIG.churchMaps;
  if (venueMaps) venueMaps.href = CONFIG.venueMaps;
  document.title = `Mis XV · ${CONFIG.quinceName}`;
}

function initIntro() {
  const skipIntroBtn = document.getElementById('skipIntroBtn');
  const intro = document.getElementById('intro');
  const video = document.getElementById('introVideo');
  const soundBtn = document.getElementById('soundBtn');
  const musicBtn = document.getElementById('musicBtn');

  if (!intro || !video) return;

  let soundEnabled = false;
  let introFinished = false;

  // ==========================================
  // TERMINAR VIDEO Y ENTRAR A LA INVITACIÓN
  // ==========================================
  const finishIntro = () => {
    if (introFinished) return;

    introFinished = true;

    video.pause();

    // Ocultar botón
    soundBtn?.classList.add('is-hidden');

    // Desaparecer video de inicio
    intro.classList.add('is-hidden');

    // Mostrar botón de música
    musicBtn?.classList.add('show');

    setTimeout(() => {
      intro.style.display = 'none';
    }, 750);

    // Iniciar música de la invitación
    window.startMusic?.();
  };


  // ==========================================
  // ACTIVAR SONIDO DEL VIDEO
  // ==========================================
  const enableSound = async () => {

    if (soundEnabled || introFinished) return;

    try {

      video.muted = false;
      video.volume = 1;

      await video.play();

      soundEnabled = true;

      // Desaparecer botón rosa
      soundBtn?.classList.add('is-hidden');

    } catch (error) {

      console.log('Esperando interacción para activar sonido.');

    }
  };


  // ==========================================
  // VIDEO INICIA AUTOMÁTICAMENTE SIN SONIDO
  // ==========================================
  video.muted = true;
  video.volume = 1;
  video.currentTime = 0;

  video.play().catch(() => {
    console.log('El navegador espera una interacción.');
  });


  // ==========================================
  // TOCAR CUALQUIER PARTE DE LA PANTALLA
  // ACTIVA EL SONIDO
  // ==========================================
  intro.addEventListener('pointerdown', enableSound);


  // ==========================================
  // TAMBIÉN FUNCIONA TOCANDO EL BOTÓN
  // ==========================================
  soundBtn?.addEventListener('click', async (event) => {

    event.preventDefault();
    event.stopPropagation();

    await enableSound();

  });


  // ==========================================
  // CUANDO TERMINA EL VIDEO
  // ENTRA AUTOMÁTICAMENTE A LA INVITACIÓN
  // ==========================================
  video.addEventListener('ended', finishIntro);

skipIntroBtn?.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopPropagation();

  finishIntro();
});
  // ==========================================
  // SI EL VIDEO FALLA
  // NO DEJA BLOQUEADA LA PÁGINA
  // ==========================================
  video.addEventListener('error', () => {

    setTimeout(finishIntro, 700);

  });
}

function initMusic() {
  const btn = document.getElementById('musicBtn');
  const music = document.getElementById('bgMusic');
  if (!btn || !music) return;
  const sync = () => {
    const playing = !music.paused;
    btn.classList.toggle('playing', playing);
    btn.textContent = playing ? '♫' : '♪';
  };
  window.startMusic = async () => { try { await music.play(); } catch (_) {} sync(); };
  btn.addEventListener('click', async () => {
    if (music.paused) { try { await music.play(); } catch (_) {} }
    else music.pause();
    sync();
  });
  music.addEventListener('play', sync);
  music.addEventListener('pause', sync);
}

function initCountdown() {
  const target = new Date(CONFIG.eventDate).getTime();
  const ids = ['days','hours','minutes','seconds'];
  if (ids.some(id => !document.getElementById(id))) return;
  const update = () => {
    const diff = Math.max(0, target - Date.now());
    const total = Math.floor(diff / 1000);
    const values = [
      Math.floor(total / 86400),
      Math.floor((total % 86400) / 3600),
      Math.floor((total % 3600) / 60),
      total % 60
    ];
    ids.forEach((id, i) => document.getElementById(id).textContent = String(values[i]).padStart(2,'0'));
  };
  update();
  setInterval(update, 1000);
}

function initCarousel() {
  const track = document.getElementById('track');
  const prev = document.getElementById('prevBtn');
  const next = document.getElementById('nextBtn');
  const dots = document.getElementById('dots');
  if (!track || !prev || !next || !dots) return;
  const slides = [...track.children];
  let timer;
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => { slideIndex = i; render(); restart(); });
    dots.appendChild(dot);
  });
  function render() {
    track.style.transform = `translateX(-${slideIndex * 100}%)`;
    dots.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === slideIndex));
  }
  function go(delta) { slideIndex = (slideIndex + delta + slides.length) % slides.length; render(); }
  function restart() { clearInterval(timer); timer = setInterval(() => go(1), 4500); }
  prev.addEventListener('click', () => { go(-1); restart(); });
  next.addEventListener('click', () => { go(1); restart(); });
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, {passive:true});
  track.addEventListener('touchend', e => {
    const endX = e.changedTouches[0].clientX;
    if (Math.abs(startX - endX) > 45) go(startX > endX ? 1 : -1);
    restart();
  }, {passive:true});
  render(); restart();
}

function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('visible'));
  }, {threshold:.13});
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function initRSVP() {
  const button = document.getElementById('confirmWhatsappBtn');
  const msg = document.getElementById('formMsg');
  button?.addEventListener('click', () => {
    const phone = String(CONFIG.whatsapp || '').replace(/\D/g, '');
    if (!phone) {
      if (msg) msg.textContent = 'Agrega el número de WhatsApp en CONFIG.whatsapp dentro de script.js.';
      return;
    }
    const text = `✨ Confirmación XV ${CONFIG.quinceName}\n\nConfirmo mi asistencia 💗⚽`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  });
}

function initSparkles() {
  const holder = document.getElementById('sparkles');
  if (!holder) return;
  setInterval(() => {
    const star = document.createElement('span');
    star.className = 'spark';
    star.style.left = `${Math.random() * 100}vw`;
    star.style.animationDuration = `${4 + Math.random() * 4}s`;
    holder.appendChild(star);
    setTimeout(() => star.remove(), 9000);
  }, 700);
}

function initPhotoLightbox() {
  const lightbox = document.getElementById('photoLightbox');
  const image = document.getElementById('photoLightboxImage');
  const close = document.getElementById('photoLightboxClose');
  if (!lightbox || !image) return;
  document.querySelectorAll('.carousel-track .slide img').forEach(photo => {
    photo.addEventListener('click', () => {
      image.src = photo.src;
      image.alt = photo.alt || 'Recuerdo';
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });
  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  };
  close?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
}
function initCustomSparkles() {

  const totalSparkles = 10;

  for (let i = 0; i < totalSparkles; i++) {

    const sparkle = document.createElement('img');

    sparkle.src = './img/brillo.png';

    sparkle.className = 'magic-custom-sparkle';

    sparkle.alt = '';

    document.body.appendChild(sparkle);

    moveCustomSparkle(sparkle);

    // Cada brillo se mueve en momentos distintos
    sparkle.style.animationDuration =
      `${4 + Math.random() * 4}s`;

    sparkle.style.animationDelay =
      `${Math.random() * 5}s`;

    // Cuando termina una animación
    // aparece en otro lugar
    sparkle.addEventListener(
      'animationiteration',
      () => {
        moveCustomSparkle(sparkle);
      }
    );
  }
}


function moveCustomSparkle(sparkle) {

  // Posición aleatoria por toda la pantalla
  sparkle.style.left =
    `${3 + Math.random() * 94}vw`;

  sparkle.style.top =
    `${3 + Math.random() * 90}vh`;

  // Algunos grandes, otros pequeños
  const size =
    16 + Math.random() * 38;

  sparkle.style.width =
    `${size}px`;
}