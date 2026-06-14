let deferredPrompt;

const installBtn = document.getElementById("installBtn");
const installContainer = document.getElementById("installContainer");

/* Service Worker */

if ('serviceWorker' in navigator) {

    navigator.serviceWorker
        .register('/service-worker.js')
        .then(() => {
            console.log("Service Worker registrado");
        });

}

/* Evento instalación */

window.addEventListener('beforeinstallprompt', (e) => {

    e.preventDefault();

    deferredPrompt = e;

    installContainer.style.display = "block";

});

installBtn.addEventListener('click', async () => {

    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === 'accepted') {

        console.log('Aplicación instalada');

    }

    installContainer.style.display = "none";

    deferredPrompt = null;

});