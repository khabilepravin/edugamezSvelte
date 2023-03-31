import { writable } from 'svelte/store';

export const spellingUserAnswers = writable([]);
export const mapUserAnswers = writable([]);
export const loading = writable();