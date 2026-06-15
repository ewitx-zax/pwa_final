// ============================
//   TECHSTORE — APP.JS
//   PWA + Carrito + Countdown
// ============================

/* ---- SERVICE WORKER ---- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/pwa_final/service-worker.js')
      .then(reg => console.log('[SW] Registrado:', reg.scope))
      .catch(err => console.warn('[SW] Error:', err));
  });
}

/* ---- INSTALACIÓN PWA ---- */
let deferredPrompt;
const installContainer = document.getElementById('installContainer');
const installBtn       = document.getElementById('installBtn');
const installClose     = document.getElementById('installClose');

// El navegador dispara este evento cuando la PWA es instalable
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Mostrar banner después de 3 segundos para no interrumpir la carga
  setTimeout(() => {
    if (installContainer) installContainer.style.display = 'block';
  }, 3000);
});

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('[PWA] Usuario eligió:', outcome);
    installContainer.style.display = 'none';
    deferredPrompt = null;
  });
}

if (installClose) {
  installClose.addEventListener('click', () => {
    installContainer.style.display = 'none';
  });
}

// Cuando ya está instalada, ocultar el banner
window.addEventListener('appinstalled', () => {
  installContainer.style.display = 'none';
  deferredPrompt = null;
  console.log('[PWA] App instalada exitosamente');
});

/* ---- CARRITO ---- */
let cartCount = 0;

function iniciarCarrito() {
  const btns    = document.querySelectorAll('.btn-cart');
  const countEl = document.querySelector('.cart-count');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      cartCount++;
      if (countEl) countEl.textContent = cartCount;

      const original = btn.textContent;
      btn.textContent = '✔ Añadido';
      btn.style.background = 'var(--rojo)';
      btn.style.color = 'white';

      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.style.color = '';
      }, 1500);
    });
  });
}

/* ---- COUNTDOWN OFERTA ---- */
function iniciarCountdown() {
  const horasEl    = document.getElementById('horas');
  const minutosEl  = document.getElementById('minutos');
  const segundosEl = document.getElementById('segundos');
  if (!horasEl) return;

  let total = 8 * 3600 + 45 * 60 + 30;

  setInterval(() => {
    if (total <= 0) return;
    total--;
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    horasEl.textContent    = String(h).padStart(2, '0');
    minutosEl.textContent  = String(m).padStart(2, '0');
    segundosEl.textContent = String(s).padStart(2, '0');
  }, 1000);
}

/* ---- HEADER: oscurece al hacer scroll ---- */
function efectoHeader() {
  const header = document.querySelector('header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.style.background = window.scrollY > 60 ? '#080808' : '';
  });
}

/* ---- INIT ---- */
document.addEventListener('DOMContentLoaded', () => {
  iniciarCarrito();
  iniciarCountdown();
  efectoHeader();
});
