// src/lib/stores/userStore.js
import { writable } from 'svelte/store';

// Create a writable store with initial empty user state
export const user = writable({
  isAuthenticated: false,
  details: null
});

// Helper functions to manage user state
export function setUser(userDetails) {
  user.set({
    isAuthenticated: true,
    details: userDetails
  });
}

export function clearUser() {
  user.set({
    isAuthenticated: false,
    details: null
  });
}