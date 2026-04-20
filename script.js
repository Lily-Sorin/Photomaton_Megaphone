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

// Fonction pour arrêter proprement la caméra
function stopStream() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => {
            track.stop();
        });
        video.srcObject = null;
    }
}

async function startCamera() {
    stopStream(); // On éteint tout avant de recommencer

    const mode = useFrontCamera ? "user" : "environment";
    
    const constraints = {
        video: {
            facingMode: { exact: mode } // "exact" force le navigateur à changer
        },
        audio: false
    };

    try {
        currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = currentStream;
    } catch (err) {
        console.warn("Échec du mode 'exact', tentative en mode souple...", err);
        // Si le mode "exact" échoue (certains vieux téléphones), on essaie le mode simple
        try {
            currentStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: mode }
            });
            video.srcObject = currentStream;
        } catch (err2) {
            alert("Erreur caméra : " + err2.message);
        }
    }
}

// Changer de caméra
switchBtn.addEventListener('click', async () => {
    useFrontCamera = !useFrontCamera;
    await startCamera();
});

// Prendre la photo
snap.addEventListener('click', () => {
    if (!video.videoWidth) return;

    const context = canvas.getContext('2d');
    
    // On garde le format 16:9 paysage
    canvas.width = 1280;
    canvas.height = 720;

    // Dessiner la vidéo
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Dessiner le cadre
    context.drawImage(frameOverlay, 0, 0, canvas.width, canvas.height);

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

// Lancement au démarrage
startCamera();