/** Short Web Audio cues — no asset files, works in the browser. */
function ctx() {
  const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  return new C();
}

function beep(frequency: number, duration: number, type: OscillatorType, gain = 0.08, delay = 0) {
  try {
    const audio = ctx();
    const osc = audio.createOscillator();
    const g = audio.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    g.gain.value = gain;
    osc.connect(g);
    g.connect(audio.destination);
    const start = audio.currentTime + delay;
    osc.start(start);
    g.gain.exponentialRampToValueAtTime(0.001, start + duration);
    osc.stop(start + duration);
  } catch {
    /* autoplay may be blocked until a click */
  }
}

export function playNotifySound(tone: "success" | "warning" | "danger" | "info") {
  if (tone === "danger") {
    beep(880, 0.18, "square", 0.07);
    beep(660, 0.22, "square", 0.07, 0.2);
    beep(880, 0.28, "square", 0.08, 0.42);
    return;
  }
  if (tone === "warning") {
    beep(520, 0.16, "triangle", 0.07);
    beep(390, 0.22, "triangle", 0.07, 0.18);
    return;
  }
  if (tone === "success") {
    beep(523, 0.09, "sine", 0.06);
    beep(784, 0.14, "sine", 0.06, 0.1);
    return;
  }
  beep(640, 0.12, "sine", 0.05);
}

let sirenTimer: number | null = null;

export function startWarningSiren() {
  stopWarningSiren();
  playNotifySound("danger");
  sirenTimer = window.setInterval(() => playNotifySound("danger"), 1600);
}

export function stopWarningSiren() {
  if (sirenTimer) {
    window.clearInterval(sirenTimer);
    sirenTimer = null;
  }
}
