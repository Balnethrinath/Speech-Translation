document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const translateBtn = document.getElementById('translateBtn');
    const stopBtn = document.getElementById('stopBtn');
    const textInput = document.getElementById('text');
    const targetSelect = document.getElementById('target');
    const translationResult = document.getElementById('translationResult');
    const audioPlayer = document.getElementById('audioPlayer');

    let recognition;
    let isListening = false;

    // Initialize the Speech Recognition
    const initializeRecognition = () => {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            isListening = true;
            startBtn.disabled = true;
            startBtn.textContent = 'Listening...';
        };

        recognition.onend = () => {
            isListening = false;
            startBtn.disabled = false;
            startBtn.textContent = 'Click to Start';
        };

        recognition.onresult = (event) => {
            const speechResult = event.results[0][0].transcript;
            textInput.value = speechResult;
        };
    };

    // Start the Speech Recognition
    const startRecognition = () => {
        if (!isListening) {
            recognition.start();
        }
    };

    // Stop the Speech Recognition
    const stopRecognition = () => {
        if (isListening) {
            recognition.stop();
        }
    };

    // Translate the text
    const translateText = () => {
        const text = textInput.value;
        const target = targetSelect.value;

        if (text.trim() === '') {
            translationResult.textContent = 'Please enter text to translate.';
            return;
        }

        translationResult.textContent = 'Translating...';

        fetch('/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `text=${encodeURIComponent(text)}&target=${encodeURIComponent(target)}`
        })
        .then(response => response.json())
        .then(data => {
            translationResult.textContent = `Translated Text: ${data.translatedText}`;
            audioPlayer.src = data.audioUrl;
            audioPlayer.style.display = 'block';
        })
        .catch(error => {
            console.error('Error:', error);
            translationResult.textContent = 'An error occurred during translation.';
        });
    };

    // Event listeners
    startBtn.addEventListener('click', startRecognition);
    stopBtn.addEventListener('click', stopRecognition);
    translateBtn.addEventListener('click', translateText);

    // Initialize the Speech Recognition
    initializeRecognition();
});
