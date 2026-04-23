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
        
        // Appliquer l'effet miroir uniquement sur la vidéo en direct (selfie)
        video.style.transform = useFrontCamera ? "scaleX(-1)" : "scaleX(1)";
    } catch (err) {
        alert("Erreur caméra : " + err.message);
    }
}

switchBtn.addEventListener('click', () => {
    useFrontCamera = !useFrontCamera;
    startCamera();
});

snap.addEventListener('click', () => {
    const context = canvas.getContext('2d');

    // 1. On donne au Canvas la taille RÉELLE du flux vidéo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // 2. Si on est en caméra selfie, on doit inverser le dessin pour que 
    // la photo finale ne soit pas inversée par rapport à ce qu'on voit
    if (useFrontCamera) {
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
    }

    // 3. On dessine la vidéo
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 4. On remet le contexte à la normale avant de dessiner le cadre
    if (useFrontCamera) {
        context.setTransform(1, 0, 0, 1, 0, 0);
    }

    // 5. On dessine le cadre par-dessus (il s'adapte à la taille du canvas)
    context.drawImage(frameOverlay, 0, 0, canvas.width, canvas.height);

    // 6. Affichage du résultat
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
snap.addEventListener('click', () => {
    const context = canvas.getContext('2d');

    // On utilise la taille réelle de la vidéo détectée par le téléphone
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // 1. Dessiner la photo
    if (useFrontCamera) {
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    context.setTransform(1, 0, 0, 1, 0, 0); // Reset miroir

    // 2. Dessiner le cadre (Il prend 100% de la largeur et hauteur du canvas)
    context.drawImage(frameOverlay, 0, 0, canvas.width, canvas.height);

    // Affichage
    const imageData = canvas.toDataURL('image/png');
    photoResult.src = imageData;
    downloadLink.href = imageData;
    
    screenCapture.style.display = 'none';
    screenResult.style.display = 'block';
});
startCamera();