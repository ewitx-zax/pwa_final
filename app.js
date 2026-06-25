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

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
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

window.addEventListener('appinstalled', () => {
  installContainer.style.display = 'none';
  deferredPrompt = null;
  console.log('[PWA] App instalada exitosamente');
});

/* ---- CARRITO ---- */
let cartItems = [];

const cartPanel = document.createElement('div');
cartPanel.id = 'cartPanel';
cartPanel.innerHTML = `
  <div id="cartOverlay" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:999;"></div>
  <div id="cartDrawer" style="
    display:none;position:fixed;top:0;right:0;height:100%;width:340px;max-width:95vw;
    background:#111;border-left:1px solid #333;z-index:1000;
    flex-direction:column;font-family:inherit;
  ">
    <div style="padding:16px 20px;border-bottom:1px solid #333;display:flex;align-items:center;justify-content:space-between;">
      <h3 style="margin:0;font-size:16px;color:#fff;">🛒 Tu carrito</h3>
      <button id="closeCart" style="background:none;border:none;color:#aaa;font-size:22px;cursor:pointer;line-height:1;">✕</button>
    </div>
    <div id="cartItemsList" style="flex:1;overflow-y:auto;padding:12px 16px;"></div>
    <div style="padding:16px 20px;border-top:1px solid #333;">
      <div style="display:flex;justify-content:space-between;font-size:15px;font-weight:600;color:#fff;margin-bottom:12px;">
        <span>Total:</span><span id="cartTotal">$0.00</span>
      </div>
      <button id="checkoutBtn" style="
        width:100%;padding:12px;background:#c0001a;color:#fff;
        border:none;border-radius:6px;font-size:15px;font-weight:600;cursor:pointer;
      ">Proceder al pago</button>
    </div>
  </div>
`;
document.body.appendChild(cartPanel);

const cartOverlay  = document.getElementById('cartOverlay');
const cartDrawer   = document.getElementById('cartDrawer');
const cartItemsList = document.getElementById('cartItemsList');
const cartTotalEl  = document.getElementById('cartTotal');
const closeCartBtn = document.getElementById('closeCart');
const checkoutBtn  = document.getElementById('checkoutBtn');

function openCart() {
  cartOverlay.style.display = 'block';
  cartDrawer.style.display  = 'flex';
}

function closeCart() {
  cartOverlay.style.display = 'none';
  cartDrawer.style.display  = 'none';
}

cartOverlay.addEventListener('click', closeCart);
closeCartBtn.addEventListener('click', closeCart);

checkoutBtn.addEventListener('click', () => {
  alert('⚠️ Parte no codificada');
});

function renderCart() {
  const countEl = document.querySelector('.cart-count');

  if (cartItems.length === 0) {
    cartItemsList.innerHTML = '<p style="text-align:center;color:#888;padding:24px 0;font-size:14px;">Tu carrito está vacío</p>';
  } else {
    cartItemsList.innerHTML = cartItems.map((item, i) => `
      <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #222;">
        <img src="${item.img}" alt="${item.name}" style="width:48px;height:48px;object-fit:cover;border-radius:6px;background:#222;" />
        <div style="flex:1;">
          <p style="margin:0 0 2px;font-size:13px;font-weight:600;color:#fff;">${item.name}</p>
          <p style="margin:0;font-size:12px;color:#aaa;">${item.price}</p>
        </div>
        <button data-index="${i}" class="remove-item" style="
          background:none;border:none;color:#666;font-size:18px;cursor:pointer;
        ">🗑</button>
      </div>
    `).join('');

    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', () => {
        cartItems.splice(Number(btn.dataset.index), 1);
        renderCart();
      });
    });
  }

  const total = cartItems.reduce((sum, item) => {
    const num = parseFloat(item.price.replace(/[$,]/g, ''));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  cartTotalEl.textContent = '$' + total.toFixed(2);
  if (countEl) countEl.textContent = cartItems.length;
}

function iniciarCarrito() {
  const btns    = document.querySelectorAll('.btn-cart');
  const countEl = document.querySelector('.cart-count');
  const cartIcon = document.querySelector('.cart-icon');

  if (cartIcon) {
    cartIcon.style.cursor = 'pointer';
    cartIcon.addEventListener('click', openCart);
  }

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const card  = btn.closest('.producto');
      const name  = card.querySelector('h3')?.textContent || 'Producto';
      const price = card.querySelector('.precio')?.firstChild?.textContent?.trim() || '$0';
      const img   = card.querySelector('img')?.src || '';

      cartItems.push({ name, price, img });
      renderCart();

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

  renderCart();
}

/* ---- BOTONES HERO ---- */
function iniciarHero() {
  const btns = document.querySelectorAll('.hero-buttons button');
  if (!btns.length) return;

  // "Comprar Ahora" → productos
  btns[0]?.addEventListener('click', () => {
    window.location.href = 'producto.html';
  });

  // "Ver Catálogo" → ofertas
  btns[1]?.addEventListener('click', () => {
    window.location.href = 'ofertas.html';
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

/* ---- HEADER SCROLL ---- */
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
  iniciarHero();
});
