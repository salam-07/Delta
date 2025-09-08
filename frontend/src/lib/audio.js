// Audio utility functions for trading sound effects

/**
 * Plays a sound effect from the public/sounds directory
 * @param {string} soundFile - The filename of the sound (e.g., 'success.mp3')
 * @param {number} volume - Volume level (0 to 1, default is 0.5)
 */
export const playSound = (soundFile, volume = 0.5) => {
    try {
        const audio = new Audio(`/sounds/${soundFile}`);
        audio.volume = Math.min(Math.max(volume, 0), 1); // Clamp volume between 0 and 1

        // Play the audio with error handling
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn('Audio playback failed:', error);
                // Fail silently to not disrupt the user experience
            });
        }
    } catch (error) {
        console.warn('Failed to create or play audio:', error);
        // Fail silently to not disrupt the user experience
    }
};

/**
 * Plays the success sound for trading actions
 */
export const playTradeSuccessSound = () => {
    playSound('success.mp3', 1);
};

/**
 * Preloads audio files for better performance
 * @param {string[]} soundFiles - Array of sound filenames to preload
 */
export const preloadSounds = (soundFiles) => {
    soundFiles.forEach(soundFile => {
        try {
            const audio = new Audio(`/sounds/${soundFile}`);
            audio.preload = 'auto';
            audio.load();
        } catch (error) {
            console.warn(`Failed to preload sound: ${soundFile}`, error);
        }
    });
};

// Preload the success sound when the module is imported
preloadSounds(['success.mp3']);
