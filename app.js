// ============================
//   TECHSTORE — APP.JS (VERSIÓN ROBUSTA)
//   PWA + Carrito + Countdown
// ============================

/* ---- SERVICE WORKER ---- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
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

// Crear el panel del carrito dinámicamente
function crearPanelCarrito() {
  // Verificar si ya existe para no duplicar
  if (document.getElementById('cartPanel')) return;
  
  const cartPanel = document.createElement('div');
  cartPanel.id = 'cartPanel';
  cartPanel.innerHTML = `
    <div id="cartOverlay" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:998;"></div>
    <div id="cartDrawer" style="
      display:none;position:fixed;top:0;right:0;height:100%;width:340px;max-width:95vw;
      background:#111;border-left:2px solid #c0001a;z-index:999;
      flex-direction:column;font-family:inherit;box-shadow:-8px 0 40px rgba(0,0,0,0.6);
    ">
      <div style="padding:18px 20px;border-bottom:1px solid #2a2a2a;display:flex;align-items:center;justify-content:space-between;">
        <h3 style="margin:0;font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:2px;color:#fff;">🛒 Tu carrito</h3>
        <button id="closeCart" style="background:none;border:none;color:#a0a0a0;font-size:22px;cursor:pointer;line-height:1;padding:4px 8px;border-radius:4px;transition:color 0.2s;">✕</button>
      </div>
      <div id="cartItemsList" style="flex:1;overflow-y:auto;padding:12px 16px;"></div>
      <div style="padding:16px 20px;border-top:1px solid #2a2a2a;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;font-size:15px;font-weight:700;color:#fff;">
          <span>Total:</span><span id="cartTotal" style="font-family:'Bebas Neue',sans-serif;font-size:22px;color:#c0001a;">$0.00</span>
        </div>
        <button id="checkoutBtn" style="
          width:100%;padding:13px;background:#c0001a;color:#fff;
          border:none;border-radius:6px;font-family:'Rajdhani',sans-serif;
          font-weight:700;font-size:15px;letter-spacing:1.5px;
          text-transform:uppercase;cursor:pointer;transition:background 0.2s,transform 0.15s;
        ">Proceder al pago</button>
      </div>
    </div>
  `;
  document.body.appendChild(cartPanel);
}

crearPanelCarrito();

const cartOverlay  = document.getElementById('cartOverlay');
const cartDrawer   = document.getElementById('cartDrawer');
const cartItemsList = document.getElementById('cartItemsList');
const cartTotalEl  = document.getElementById('cartTotal');
const closeCartBtn = document.getElementById('closeCart');
const checkoutBtn  = document.getElementById('checkoutBtn');

function openCart() {
  if (cartOverlay) cartOverlay.style.display = 'block';
  if (cartDrawer) cartDrawer.style.display  = 'flex';
}

function closeCart() {
  if (cartOverlay) cartOverlay.style.display = 'none';
  if (cartDrawer) cartDrawer.style.display  = 'none';
}

if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);

if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    alert('⚠️ Parte no codificada');
  });
}

function renderCart() {
  const countEl = document.querySelector('.cart-count');

  if (!cartItemsList) return;

  if (cartItems.length === 0) {
    cartItemsList.innerHTML = `
      <div style="text-align:center;padding:40px 0;color:#a0a0a0;font-size:14px;">
        <span style="font-size:40px;display:block;margin-bottom:10px;">🛒</span>
        Tu carrito está vacío
      </div>
    `;
  } else {
    cartItemsList.innerHTML = cartItems.map((item, i) => `
      <div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #2a2a2a;">
        <img src="${item.img || 'https://via.placeholder.com/52'}" alt="${item.name}" style="width:52px;height:52px;object-fit:cover;border-radius:6px;background:#2a2a2a;" />
        <div style="flex:1;">
          <p style="margin:0 0 3px;font-size:13px;font-weight:700;color:#fff;">${item.name}</p>
          <p style="margin:0;font-size:14px;color:#c0001a;font-family:'Bebas Neue',sans-serif;letter-spacing:1px;">${item.price}</p>
        </div>
        <button data-index="${i}" class="remove-item" style="
          background:none;border:none;color:#a0a0a0;font-size:18px;cursor:pointer;
          padding:4px 6px;border-radius:4px;transition:color 0.2s;line-height:1;
        ">🗑</button>
      </div>
    `).join('');

    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', function() {
        const index = parseInt(this.dataset.index);
        if (!isNaN(index)) {
          cartItems.splice(index, 1);
          renderCart();
        }
      });
    });
  }

  const total = cartItems.reduce((sum, item) => {
    const num = parseFloat(item.price.replace(/[$,]/g, ''));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  if (cartTotalEl) cartTotalEl.textContent = '$' + total.toFixed(2);
  if (countEl) countEl.textContent = cartItems.length;
}

/* ---- FUNCIÓN PRINCIPAL DEL CARRITO (MÁS ROBUSTA) ---- */
function iniciarCarrito() {
  console.log('[Carrito] Inicializando...');
  
  // Buscar TODOS los botones con clase .btn-cart
  const btns = document.querySelectorAll('.btn-cart');
  console.log(`[Carrito] Encontrados ${btns.length} botones`);
  
  // Buscar el ícono del carrito
  const cartIcon = document.querySelector('.cart-icon');
  if (cartIcon) {
    cartIcon.style.cursor = 'pointer';
    cartIcon.addEventListener('click', openCart);
  }

  // Si no hay botones, no hacemos nada más
  if (btns.length === 0) {
    console.warn('[Carrito] No se encontraron botones .btn-cart');
    return;
  }

  // Agregar evento a CADA botón
  btns.forEach((btn, index) => {
    // Eliminar eventos anteriores para evitar duplicados
    btn.removeEventListener('click', handleAddToCart);
    // Agregar nuevo evento
    btn.addEventListener('click', handleAddToCart);
  });

  renderCart();
}

/* ---- MANEJADOR DE AGREGAR AL CARRITO ---- */
function handleAddToCart(event) {
  const btn = event.currentTarget;
  const card = btn.closest('.producto');
  
  // Si no encuentra el contenedor .producto, buscar el padre más cercano
  if (!card) {
    console.warn('[Carrito] No se encontró el contenedor .producto');
    return;
  }

  // Obtener datos del producto (con fallbacks)
  const nameEl = card.querySelector('h3');
  const priceEl = card.querySelector('.precio');
  const imgEl = card.querySelector('img');
  
  const name = nameEl ? nameEl.textContent.trim() : 'Producto sin nombre';
  const price = priceEl ? priceEl.textContent.trim() : '$0';
  const img = imgEl ? imgEl.src : 'https://via.placeholder.com/100';

  // Agregar al carrito
  cartItems.push({ name, price, img });
  renderCart();

  // Feedback visual
  const originalText = btn.textContent;
  btn.textContent = '✔ Añadido';
  btn.style.background = '#c0001a';
  btn.style.color = 'white';
  
  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = '';
    btn.style.color = '';
  }, 1500);

  console.log(`[Carrito] Añadido: ${name} - ${price}`);
}

/* ---- BOTONES HERO ---- */
function iniciarHero() {
  // Los botones del hero ya son <a> con href, no necesitan JS
  console.log('[Hero] Botones listos');
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

/* ---- MUTATION OBSERVER (para detectar productos agregados dinámicamente) ---- */
function observarCambios() {
  const observer = new MutationObserver(() => {
    // Si se agregan nuevos botones, reiniciar el carrito
    const btns = document.querySelectorAll('.btn-cart');
    if (btns.length > 0) {
      iniciarCarrito();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

/* ---- INIT ---- */
document.addEventListener('DOMContentLoaded', () => {
  console.log('[TechStore] Inicializando...');
  iniciarCarrito();
  iniciarCountdown();
  efectoHeader();
  iniciarHero();
  observarCambios(); // Para detectar nuevos productos
});

// También ejecutar cuando la página esté completamente cargada
window.addEventListener('load', () => {
  // Re-inicializar por si acaso
  setTimeout(() => {
    iniciarCarrito();
  }, 500);
});

/* ---- EXPONER FUNCIONES GLOBALES (para depuración) ---- */
window.reiniciarCarrito = iniciarCarrito;
window.verCarrito = () => console.log('Carrito:', cartItems);
window.limpiarCarrito = () => { cartItems = []; renderCart(); };
