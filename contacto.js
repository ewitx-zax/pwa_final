// ============================
//   CONTACTO.JS
// ============================

/* ---- FORMULARIO CON VALIDACIÓN ---- */
const form        = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const btnTxt      = document.getElementById('btnTxt');
const btnLoader   = document.getElementById('btnLoader');
const mensajeEl   = document.getElementById('mensaje');
const charCount   = document.getElementById('charCount');

// Contador de caracteres
mensajeEl?.addEventListener('input', () => {
  const len = mensajeEl.value.length;
  charCount.textContent = len;
  charCount.style.color = len > 480 ? 'var(--rojo)' : '';
});

// Validación individual
function validarCampo(id, errId, regla, msg) {
  const el  = document.getElementById(id);
  const err = document.getElementById(errId);
  if (!el || !err) return true;
  if (!regla(el.value)) {
    err.textContent = msg;
    el.classList.add('invalido');
    return false;
  }
  err.textContent = '';
  el.classList.remove('invalido');
  return true;
}

// Envío
form?.addEventListener('submit', (e) => {
  e.preventDefault();

  const ok = [
    validarCampo('nombre',  'errNombre',  v => v.trim().length >= 3,            'Ingresa tu nombre completo'),
    validarCampo('email',   'errEmail',   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Correo no válido'),
    validarCampo('asunto',  'errAsunto',  v => v !== '',                         'Selecciona un asunto'),
    validarCampo('mensaje', 'errMensaje', v => v.trim().length >= 10,            'Mensaje demasiado corto (mín. 10 caracteres)'),
  ].every(Boolean);

  if (!ok) return;

  // Simula envío
  btnTxt.style.display    = 'none';
  btnLoader.style.display = 'inline';
  form.querySelector('.btn-enviar').disabled = true;

  setTimeout(() => {
    form.style.display        = 'none';
    formSuccess.style.display = 'block';
  }, 1500);
});

// Limpiar error al escribir
['nombre','email','asunto','telefono','mensaje'].forEach(id => {
  const el = document.getElementById(id);
  const errId = 'err' + id.charAt(0).toUpperCase() + id.slice(1);
  el?.addEventListener('input', () => {
    const err = document.getElementById(errId);
    if (err) err.textContent = '';
    el.classList.remove('invalido');
  });
});

/* ---- FAQ ACCORDION ---- */
document.querySelectorAll('.faq-pregunta').forEach(btn => {
  btn.addEventListener('click', () => {
    const item    = btn.closest('.faq-item');
    const abierto = item.classList.contains('abierto');

    // Cierra todos
    document.querySelectorAll('.faq-item.abierto').forEach(i => i.classList.remove('abierto'));

    // Abre el actual si estaba cerrado
    if (!abierto) item.classList.add('abierto');
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