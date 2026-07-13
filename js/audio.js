/**
 * audio.js
 * -----------------------------------------------------------------------
 * Gestion de tout ce qui est sonore et haptique dans l'application :
 *  - petit "tic" de validation au clic sur le compteur
 *  - son de succès quand un dhikr est terminé
 *  - vibration mobile (Vibration API)
 *  - lecture audio d'un dhikr (texte-à-parole via Web Speech API en
 *    remplacement de fichiers audio, l'app fonctionnant sans dépendance
 *    externe ; il suffit de déposer de vrais fichiers mp3 dans
 *    assets/sounds/ et de les référencer ici pour une voix récitée réelle)
 * -----------------------------------------------------------------------
 */

const AudioManager = (() => {
  let audioCtx = null;
  let currentUtterance = null;
  let isSpeaking = false;
  let volume = 1;

  function getContext() {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioCtx();
    }
    return audioCtx;
  }

  /** Joue un bip synthétique très court (pas de fichier requis). */
  function playTone(frequency = 440, duration = 0.08, type = "sine") {
    try {
      const ctx = getContext();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      gain.gain.value = 0.15 * volume;
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start();
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      oscillator.stop(ctx.currentTime + duration);
    } catch (err) {
      // Silencieux : certains navigateurs bloquent l'audio avant interaction
    }
  }

  function playClickSound() {
    playTone(660, 0.06, "sine");
  }

  function playCompleteSound() {
    playTone(523, 0.1, "sine");
    setTimeout(() => playTone(784, 0.15, "sine"), 90);
  }

  function vibrate(pattern = 15) {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }

  /** Lecture du dhikr via synthèse vocale (langue arabe). */
  function speak(text, { onEnd, onStart } = {}) {
    if (!("speechSynthesis" in window)) return false;
    stopSpeaking();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";
    utterance.rate = 0.85;
    utterance.volume = volume;
    utterance.onstart = () => {
      isSpeaking = true;
      if (onStart) onStart();
    };
    utterance.onend = () => {
      isSpeaking = false;
      if (onEnd) onEnd();
    };
    utterance.onerror = () => {
      isSpeaking = false;
      if (onEnd) onEnd();
    };
    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  }

  function pauseSpeaking() {
    if ("speechSynthesis" in window) window.speechSynthesis.pause();
  }

  function resumeSpeaking() {
    if ("speechSynthesis" in window) window.speechSynthesis.resume();
  }

  function stopSpeaking() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    isSpeaking = false;
  }

  function setVolume(v) {
    volume = Math.max(0, Math.min(1, v));
  }

  function getIsSpeaking() {
    return isSpeaking;
  }

  return {
    playClickSound,
    playCompleteSound,
    vibrate,
    speak,
    pauseSpeaking,
    resumeSpeaking,
    stopSpeaking,
    setVolume,
    getIsSpeaking
  };
})();
