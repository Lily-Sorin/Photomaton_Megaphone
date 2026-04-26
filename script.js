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

// Remplacez par votre URL réelle de Google Apps Script
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxczYoXrv7RRcjiuZzNz_9YWAl3oiatLBFp3tFZZCPiW9AakuJOFJVbJqKujO4iRS9_Hg/exec";

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
        video.style.transform = useFrontCamera ? "scaleX(-1)" : "scaleX(1)";
    } catch (err) {
        alert("Erreur caméra : " + err.message);
    }
}

function uploadToDrive(base64Data) {
    fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Data })
    })
    .then(() => console.log("Tentative d'envoi au Drive terminée."))
    .catch(err => console.error("Erreur d'envoi :", err));
}

// Un seul écouteur pour le bouton capture
snap.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    if (useFrontCamera) {
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.drawImage(frameOverlay, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/png');
    
    // Affichage immédiat
    photoResult.src = imageData;
    downloadLink.href = imageData;
    screenCapture.style.display = 'none';
    screenResult.style.display = 'block';

    // Envoi Drive en tâche de fond
    uploadToDrive(imageData);
});

switchBtn.addEventListener('click', () => {
    useFrontCamera = !useFrontCamera;
    startCamera();
});

retake.addEventListener('click', () => {
    screenResult.style.display = 'none';
    screenCapture.style.display = 'block';
});

// Lancer la caméra au démarrage
startCamera();