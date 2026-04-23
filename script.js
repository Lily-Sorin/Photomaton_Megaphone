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

let currentStream = null;
let useFrontCamera = true;

async function startCamera() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }

    const mode = useFrontCamera ? "user" : "environment";
    
    try {
        currentStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: mode },
            audio: false
        });
        video.srcObject = currentStream;
        
        // Appliquer l'effet miroir visuel uniquement sur la vidéo en direct (selfie)
        video.style.transform = useFrontCamera ? "scaleX(-1)" : "scaleX(1)";
    } catch (err) {
        alert("Erreur caméra : " + err.message);
    }
}

// Changer de caméra
switchBtn.addEventListener('click', () => {
    useFrontCamera = !useFrontCamera;
    startCamera();
});

// Écouteur de capture UNIQUE
snap.addEventListener('click', () => {
    const context = canvas.getContext('2d');

    // On utilise la taille réelle de la vidéo pour s'adapter à la photo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Gérer l'inversion pour que la photo ne soit pas en miroir (texte lisible)
    if (useFrontCamera) {
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    context.setTransform(1, 0, 0, 1, 0, 0); // Reset miroir

    // Dessiner le cadre qui s'étire pour couvrir toute la photo
    context.drawImage(frameOverlay, 0, 0, canvas.width, canvas.height);

    // Affichage du résultat
    const imageData = canvas.toDataURL('image/png');
    photoResult.src = imageData;
    downloadLink.href = imageData;
    
    screenCapture.style.display = 'none';
    screenResult.style.display = 'block';
});

// Refaire une photo
retake.addEventListener('click', () => {
    screenResult.style.display = 'none';
    screenCapture.style.display = 'block';
});

// Lancement au chargement
startCamera();