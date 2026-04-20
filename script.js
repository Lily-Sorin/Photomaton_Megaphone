const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snap = document.getElementById('snap');
const retake = document.getElementById('retake');
const photoResult = document.getElementById('photo-result');
const downloadLink = document.getElementById('download-link');
const frameOverlay = document.getElementById('frame-overlay');

const screenCapture = document.getElementById('screen-capture');
const screenResult = document.getElementById('screen-result');

// 1. Démarrer la caméra
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "user" }, 
            audio: false 
        });
        video.srcObject = stream;
    } catch (err) {
        alert("Erreur caméra : " + err.message);
    }
}

// 2. Prendre la photo
snap.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Dessiner la vidéo
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    // Dessiner le cadre
    context.drawImage(frameOverlay, 0, 0, canvas.width, canvas.height);

    // Convertir en image et afficher
    const imageData = canvas.toDataURL('image/png');
    photoResult.src = imageData;
    downloadLink.href = imageData;

    // Changer "d'écran"
    screenCapture.style.display = 'none';
    screenResult.style.display = 'block';
});

// 3. Recommencer (Bouton Refaire)
retake.addEventListener('click', () => {
    screenResult.style.display = 'none';
    screenCapture.style.display = 'block';
});

// Lancement
startCamera();