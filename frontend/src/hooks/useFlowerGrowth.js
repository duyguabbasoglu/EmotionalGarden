import { useState, useEffect } from 'react';

/**
 * Drives a flower scene's bloom + loading bar.
 *
 * Progress is read from the clock rather than counted per tick, so the bar
 * always takes `duration` no matter how often the timer actually fires — on a
 * slow device, or in a background tab where timers are throttled to about one
 * a second, it still finishes on time instead of crawling.
 *
 * @param {number} duration - how long the loading bar should take, in ms
 * @returns {{ bloomed: boolean, loading: boolean, progress: number }}
 */
export const useFlowerGrowth = (duration = 3500) => {
    const [bloomed, setBloomed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const start = performance.now();
        const bloom = setTimeout(() => setBloomed(true), 10);

        const interval = setInterval(() => {
            const pct = Math.min(((performance.now() - start) / duration) * 100, 100);
            setProgress(pct);
            if (pct >= 100) {
                clearInterval(interval);
                setTimeout(() => setLoading(false), 200);
            }
        }, 50);

        return () => { clearTimeout(bloom); clearInterval(interval); };
    }, [duration]);

    return { bloomed, loading, progress };
};

export default useFlowerGrowth;
