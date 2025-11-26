/**
 * Sound Effects Manager for Rizal Learning App
 * Provides audio feedback for user interactions
 */

class SoundManager {
    constructor() {
        this.sounds = {};
        this.enabled = true;
        this.volume = 0.5;

        // Load sound enabled preference from localStorage
        const savedPreference = localStorage.getItem('soundEnabled');
        if (savedPreference !== null) {
            this.enabled = savedPreference === 'true';
        }
    }

    /**
     * Create an audio element from a data URL or file path
     */
    createSound(name, frequency, duration = 0.2, type = 'sine') {
        if (typeof window === 'undefined' || !window.AudioContext) {
            return null;
        }

        // Store sound configuration for later playback
        this.sounds[name] = {
            frequency,
            duration,
            type
        };
    }

    /**
     * Play a sound using Web Audio API
     */
    play(name) {
        if (!this.enabled || !this.sounds[name]) {
            return;
        }

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioContext();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            const sound = this.sounds[name];

            oscillator.type = sound.type;
            oscillator.frequency.setValueAtTime(sound.frequency, audioContext.currentTime);

            gainNode.gain.setValueAtTime(this.volume, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + sound.duration);

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + sound.duration);
        } catch (error) {
            console.warn('Error playing sound:', error);
        }
    }

    /**
     * Play a success sound (correct answer)
     */
    playSuccess() {
        this.play('success');
    }

    /**
     * Play an error sound (wrong answer)
     */
    playError() {
        this.play('error');
    }

    /**
     * Play a click sound
     */
    playClick() {
        this.play('click');
    }

    /**
     * Play a level complete sound
     */
    playLevelComplete() {
        this.play('levelComplete');
    }

    /**
     * Play a badge earned sound
     */
    playBadge() {
        this.play('badge');
    }

    /**
     * Play a hover sound
     */
    playHover() {
        this.play('hover');
    }

    /**
     * Toggle sound on/off
     */
    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('soundEnabled', this.enabled.toString());
        return this.enabled;
    }

    /**
     * Set volume (0.0 to 1.0)
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }

    /**
     * Check if sound is enabled
     */
    isEnabled() {
        return this.enabled;
    }

    /**
     * Initialize all game sounds
     */
    initializeSounds() {
        // Success sound - cheerful ascending notes
        this.createSound('success', 523.25, 0.15, 'sine'); // C5

        // Error sound - descending tone
        this.createSound('error', 220, 0.3, 'sawtooth'); // A3

        // Click sound - short beep
        this.createSound('click', 800, 0.05, 'sine');

        // Level complete - triumphant sound
        this.createSound('levelComplete', 659.25, 0.4, 'sine'); // E5

        // Badge earned - special chime
        this.createSound('badge', 880, 0.5, 'sine'); // A5

        // Hover sound - subtle tone
        this.createSound('hover', 1000, 0.03, 'sine');
    }

    /**
     * Play a melody (sequence of notes)
     */
    playMelody(notes, tempo = 200) {
        if (!this.enabled) return;

        notes.forEach((note, index) => {
            setTimeout(() => {
                try {
                    const AudioContext = window.AudioContext || window.webkitAudioContext;
                    const audioContext = new AudioContext();
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();

                    oscillator.type = 'sine';
                    oscillator.frequency.setValueAtTime(note.frequency, audioContext.currentTime);

                    gainNode.gain.setValueAtTime(this.volume * 0.3, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + note.duration);

                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);

                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + note.duration);
                } catch (error) {
                    console.warn('Error playing melody note:', error);
                }
            }, index * tempo);
        });
    }

    /**
     * Play success melody
     */
    playSuccessMelody() {
        const melody = [
            { frequency: 523.25, duration: 0.15 }, // C5
            { frequency: 659.25, duration: 0.15 }, // E5
            { frequency: 783.99, duration: 0.3 }   // G5
        ];
        this.playMelody(melody, 150);
    }

    /**
     * Play level complete melody
     */
    playLevelCompleteMelody() {
        const melody = [
            { frequency: 523.25, duration: 0.2 }, // C5
            { frequency: 659.25, duration: 0.2 }, // E5
            { frequency: 783.99, duration: 0.2 }, // G5
            { frequency: 1046.50, duration: 0.4 } // C6
        ];
        this.playMelody(melody, 180);
    }
}

// Create singleton instance
const soundManager = new SoundManager();
soundManager.initializeSounds();

export default soundManager;

// Export individual functions for convenience
export const playSuccess = () => soundManager.playSuccessMelody();
export const playError = () => soundManager.playError();
export const playClick = () => soundManager.playClick();
export const playLevelComplete = () => soundManager.playLevelCompleteMelody();
export const playBadge = () => soundManager.playBadge();
export const playHover = () => soundManager.playHover();
export const toggleSound = () => soundManager.toggle();
export const isSoundEnabled = () => soundManager.isEnabled();
