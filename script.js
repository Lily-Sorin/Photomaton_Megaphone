const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snap = document.getElementById('snap');
const switchBtn = document.getElementById('switch-camera');
const retake = document.getElementById('retake');
const photoResult = document.getElementById('photo-result');
const downloadLink = document.getElementById('download-link');
const frameOverlay = document.getElementById('frame-overlay');
const screenCapture = document.getElementById('screen-capture');
const screenResult = document.getElementById('screen-result');

let currentStream;
let useFrontCamera = true; // Par défaut : caméra selfie

async function startCamera() {
    // Si un flux existe déjà, on l'arrête avant d'en changer
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }

    const constraints = {
        video: {
            facingMode: useFrontCamera ? "user" : "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 }
        },
        audio: false
    };

    try {
        currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = currentStream;
    } catch (err) {
        console.error("Erreur caméra : ", err);
    }
}

// Changer de caméra
switchBtn.addEventListener('click', () => {
    useFrontCamera = !useFrontCamera;
    startCamera();
});

// Prendre la photo
snap.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    
    // On définit le canvas en 16:9
    canvas.width = 1280;
    canvas.height = 720;

    // Dessiner la vidéo (ajustée au cadre)
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Dessiner le cadre par-dessus
    context.drawImage(frameOverlay, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/png');
    photoResult.src = imageData;
    downloadLink.href = imageData;

    screenCapture.style.display = 'none';
    screenResult.style.display = 'block';
});

retake.addEventListener('click', () => {
    screenResult.style.display = 'none';
    screenCapture.style.display = 'block';
});

startCamera();