import { useState, useEffect } from 'react';

/**
 * Custom hook for managing flower bloom animation state
 * @param {number} duration - Total duration of loading in ms (default: 3500)
 * @returns {{ bloomed: boolean, loading: boolean, progress: number }}
 */
export const useFlowerGrowth = (duration = 3500) => {
    const [bloomed, setBloomed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Start bloom animation
        setTimeout(() => setBloomed(true), 10);

        const intervalTime = 50;
        const steps = duration / intervalTime;
        let currentStep = 0;

        const interval = setInterval(() => {
            currentStep++;
            const newProgress = Math.min((currentStep / steps) * 100, 100);
            setProgress(newProgress);

            if (currentStep >= steps) {
                clearInterval(interval);
                setTimeout(() => setLoading(false), 200);
            }
        }, intervalTime);

        return () => clearInterval(interval);
    }, [duration]);

    return { bloomed, loading, progress };
};

export default useFlowerGrowth;
