// Chapter background music utility
// Uses Web Audio API to play background music for each chapter

class ChapterMusicPlayer {
    constructor() {
        this.audio = null;
        this.currentChapter = null;
        this.volume = 0.3; // Default volume (30%)
        this.isPlaying = false;
    }

    // Chapter music mapping - using royalty-free music URLs
    // Note: In production, you should host these files locally
    getMusicUrl(chapterId) {
        const musicMap = {
            1: '/music/chapter1-childhood.mp3',      // Gentle, playful music
            2: '/music/chapter2-education.mp3',     // Inspiring, academic music
            3: '/music/chapter3-adventure.mp3',     // Adventurous, travel music
            4: '/music/chapter4-literary.mp3',      // Dramatic, literary music
            5: '/music/chapter5-heroic.mp3',        // Heroic, patriotic music
            6: '/music/chapter6-legacy.mp3',        // Reflective, inspirational music
        };

        return musicMap[chapterId] || null;
    }

    play(chapterId) {
        // If already playing the same chapter music, do nothing
        if (this.currentChapter === chapterId && this.isPlaying) {
            return;
        }

        // Stop current music if playing
        this.stop();

        const musicUrl = this.getMusicUrl(chapterId);
        if (!musicUrl) {
            console.warn(`No music found for chapter ${chapterId}`);
            return;
        }

        try {
            this.audio = new Audio(musicUrl);
            this.audio.volume = this.volume;
            this.audio.loop = true; // Loop the music

            // Play the music
            const playPromise = this.audio.play();

            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        this.isPlaying = true;
                        this.currentChapter = chapterId;
                        console.log(`Playing music for chapter ${chapterId}`);
                    })
                    .catch(error => {
                        console.warn('Music playback failed:', error);
                        // Autoplay might be blocked by browser
                        // User interaction required
                    });
            }
        } catch (error) {
            console.error('Error playing chapter music:', error);
        }
    }

    stop() {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.audio = null;
            this.isPlaying = false;
            this.currentChapter = null;
        }
    }

    pause() {
        if (this.audio && this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
        }
    }

    resume() {
        if (this.audio && !this.isPlaying) {
            this.audio.play()
                .then(() => {
                    this.isPlaying = true;
                })
                .catch(error => {
                    console.warn('Music resume failed:', error);
                });
        }
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume)); // Clamp between 0 and 1
        if (this.audio) {
            this.audio.volume = this.volume;
        }
    }

    getVolume() {
        return this.volume;
    }

    isCurrentlyPlaying() {
        return this.isPlaying;
    }
}

// Create a singleton instance
const chapterMusicPlayer = new ChapterMusicPlayer();

export default chapterMusicPlayer;
