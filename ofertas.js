// ============================
//   OFERTAS.JS
// ============================

/* ---- COUNTDOWN ---- */
function iniciarCountdown() {
  const diasEl     = document.getElementById('dias');
  const horasEl    = document.getElementById('horas');
  const minutosEl  = document.getElementById('minutos');
  const segundosEl = document.getElementById('segundos');
  if (!horasEl) return;

  let total = 2 * 86400 + 8 * 3600 + 45 * 60 + 30;

  setInterval(() => {
    if (total <= 0) return;
    total--;
    const d = Math.floor(total / 86400);
    const h = Math.floor((total % 86400) / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    if (diasEl)     diasEl.textContent     = String(d).padStart(2, '0');
    horasEl.textContent    = String(h).padStart(2, '0');
    minutosEl.textContent  = String(m).padStart(2, '0');
    segundosEl.textContent = String(s).padStart(2, '0');
  }, 1000);
}

/* ---- CARRITO ---- */
function iniciarCarrito() {
  const btns    = document.querySelectorAll('.btn-cart, .od-btn');
  const countEl = document.querySelector('.cart-count');
  let count = 0;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      count++;
      if (countEl) countEl.textContent = count;
      const orig = btn.textContent;
      btn.textContent = '✔ Añadido';
      btn.style.background = 'var(--rojo)';
      btn.style.color = 'white';
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
        btn.style.color = '';
      }, 1500);
    });
  });
}

/* ---- NEWSLETTER ---- */
function iniciarNewsletter() {
  const form  = document.querySelector('.newsletter-form');
  const input = form?.querySelector('input');
  const btn   = form?.querySelector('button');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!input?.value.includes('@')) {
      input.style.borderColor = 'var(--rojo)';
      input.placeholder = 'Ingresa un correo válido';
      return;
    }
    btn.textContent = '✔ Suscrito';
    btn.style.background = '#16a34a';
    input.value = '';
    input.placeholder = '¡Gracias! Te avisaremos de las ofertas.';
    setTimeout(() => {
      btn.textContent = 'Suscribirme';
      btn.style.background = '';
    }, 3000);
  });
}

/* ---- HEADER SCROLL ---- */
function efectoHeader() {
  const header = document.querySelector('header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.style.background = window.scrollY > 60 ? '#080808' : '';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  iniciarCountdown();
  iniciarCarrito();
  iniciarNewsletter();
  efectoHeader();
});