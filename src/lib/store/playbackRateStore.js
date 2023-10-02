import { writable } from 'svelte/store';
import { localStorageStore } from '@skeletonlabs/skeleton';

export const currentPlaybackRate = localStorageStore('currentPlaybackRate', 1.0);