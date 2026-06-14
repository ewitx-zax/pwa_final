// ============================
//   PRODUCTOS.JS — Filtros & Orden
// ============================

const filtros      = document.querySelectorAll('.filtro');
const cards        = document.querySelectorAll('.producto');
const ordenSelect  = document.getElementById('ordenSelect');
const grid         = document.getElementById('productosGrid');
const countEl      = document.getElementById('count');

// ---- FILTRAR POR CATEGORÍA ----
filtros.forEach(btn => {
  btn.addEventListener('click', () => {
    filtros.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filtrar(btn.dataset.cat);
  });
});

function filtrar(cat) {
  let visible = 0;
  // Quitar mensaje de sin resultados anterior
  const prev = grid.querySelector('.sin-resultados');
  if (prev) prev.remove();

  cards.forEach(card => {
    const mostrar = cat === 'todos' || card.dataset.cat === cat;
    card.classList.toggle('oculto', !mostrar);
    if (mostrar) visible++;
  });

  if (countEl) countEl.textContent = visible;

  if (visible === 0) {
    const msg = document.createElement('div');
    msg.className = 'sin-resultados';
    msg.innerHTML = '<p>🔍</p><h3>No hay productos en esta categoría</h3>';
    grid.appendChild(msg);
  }
}

// ---- ORDENAR ----
ordenSelect?.addEventListener('change', () => {
  const valor  = ordenSelect.value;
  const items  = [...grid.querySelectorAll('.producto:not(.oculto)')];

  items.sort((a, b) => {
    if (valor === 'precio-asc')  return parseFloat(a.dataset.precio) - parseFloat(b.dataset.precio);
    if (valor === 'precio-desc') return parseFloat(b.dataset.precio) - parseFloat(a.dataset.precio);
    if (valor === 'nombre')      return a.dataset.nombre.localeCompare(b.dataset.nombre);
    return 0;
  });

  items.forEach(item => grid.appendChild(item));
});