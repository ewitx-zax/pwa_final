// ============================
//   CATEGORIAS.JS
// ============================

/* ---- BOTONES "VER TODO" → redirige a productos filtrado ---- */
document.querySelectorAll('.btn-cat').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const cat = btn.closest('.cat-card').dataset.cat;
    // Guarda el filtro en sessionStorage y va a productos
    sessionStorage.setItem('filtroCategoria', cat);
    window.location.href = 'productos.html';
  });
});

// Clic en toda la card también navega
document.querySelectorAll('.cat-card').forEach(card => {
  card.addEventListener('click', () => {
    sessionStorage.setItem('filtroCategoria', card.dataset.cat);
    window.location.href = 'productos.html';
  });
});

// Cats pequeñas
document.querySelectorAll('.cat-chica').forEach(cat => {
  cat.addEventListener('click', () => {
    const nombre = cat.querySelector('h3').textContent.toLowerCase().replace(/\s+/g, '');
    sessionStorage.setItem('filtroCategoria', nombre);
    window.location.href = 'productos.html';
  });
});

/* ---- HEADER SCROLL ---- */
function efectoHeader() {
  const header = document.querySelector('header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.style.background = window.scrollY > 60 ? '#080808' : '';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  efectoHeader();
});