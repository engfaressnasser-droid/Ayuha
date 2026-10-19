/**
 * Web Audio Engine for Romantic Melodies and Ambient Piano
 * Provides both synthesized piano chords/arpeggio for 100% offline reliability
 * and HTML5 Audio playback for user custom tracks.
 */

class RomanticAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlayingSynth: boolean = false;
  private synthInterval: number | null = null;
  private noteIndex: number = 0;
  private masterGain: GainNode | null = null;

  // Romantic chord progression in C/Am (Emotional, tender, warm)
  // Cmaj7 -> Am9 -> Fmaj7 -> Gsus4 / G
  private chords = [
    { root: 261.63, notes: [261.63, 329.63, 392.00, 493.88] }, // Cmaj7 (C4, E4, G4, B4)
    { root: 220.00, notes: [220.00, 261.63, 329.63, 392.00] }, // Am7 (A3, C4, E4, G4)
    { root: 174.61, notes: [174.61, 261.63, 329.63, 392.00] }, // Fmaj7 (F3, C4, E4, G4)
    { root: 196.00, notes: [196.00, 246.94, 293.66, 392.00] }, // G (G3, B3, D4, G4)
    { root: 220.00, notes: [220.00, 261.63, 329.63, 440.00] }, // Am (A3, C4, E4, A4)
    { root: 293.66, notes: [293.66, 349.23, 440.00, 523.25] }, // Dm7 (D4, F4, A4, C5)
    { root: 196.00, notes: [196.00, 293.66, 392.00, 493.88] }, // G7 (G3, D4, G4, B4)
    { root: 261.63, notes: [261.63, 329.63, 392.00, 523.25] }, // C (C4, E4, G4, C5)
  ];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Play a single piano-like chime tone
  private playPianoNote(freq: number, duration: number = 2.4, velocity: number = 0.25) {
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const oscHarmonic = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Warm piano tone
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    // Subtle gentle harmonic
    oscHarmonic.type = 'sine';
    oscHarmonic.frequency.setValueAtTime(freq * 2, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(400, now + duration);

    // Natural piano envelope: fast attack, warm decay
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(velocity, now + 0.04);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    oscHarmonic.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc.start(now);
    oscHarmonic.start(now);
    osc.stop(now + duration);
    oscHarmonic.stop(now + duration);
  }

  public startRomanticMelody() {
    this.initContext();
    if (this.isPlayingSynth) return;
    this.isPlayingSynth = true;

    // Arpeggiate through romantic progression
    let chordIdx = 0;
    let step = 0;

    const playNext = () => {
      if (!this.isPlayingSynth || !this.ctx) return;
      const currentChord = this.chords[chordIdx];
      const notes = currentChord.notes;

      // Play bass note on step 0
      if (step === 0) {
        this.playPianoNote(currentChord.root / 2, 3.2, 0.35);
      }

      // Arpeggiate chord notes gently
      const noteFreq = notes[step % notes.length];
      this.playPianoNote(noteFreq, 2.0, 0.22);

      // Random gentle high bell sparkle occasionally
      if (Math.random() > 0.65) {
        setTimeout(() => {
          if (this.isPlayingSynth) {
            this.playPianoNote(noteFreq * 2, 1.8, 0.09);
          }
        }, 180);
      }

      step++;
      if (step >= 4) {
        step = 0;
        chordIdx = (chordIdx + 1) % this.chords.length;
      }
    };

    playNext();
    this.synthInterval = window.setInterval(playNext, 460);
  }

  public stopRomanticMelody() {
    this.isPlayingSynth = false;
    if (this.synthInterval !== null) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  public isSynthPlaying(): boolean {
    return this.isPlayingSynth;
  }

  public setVolume(val: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime);
    }
  }

  // Play sparkle sound effect for celebrations
  public playCelebrationChime() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const frequencies = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    frequencies.forEach((f, idx) => {
      setTimeout(() => {
        this.playPianoNote(f, 1.5, 0.2);
      }, idx * 100);
    });
  }
}

export const romanticAudio = new RomanticAudioEngine();
