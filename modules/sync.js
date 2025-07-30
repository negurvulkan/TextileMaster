import { getProgress, setProgress } from './state.js';
import { api } from './api.js';

export async function pushProgress() {
    const entries = getProgress();
    if (!entries.length) return;
    try {
        await api.create('progress', entries);
        setProgress([]);
    } catch (e) {
        /* keep entries for later */
    }
}
