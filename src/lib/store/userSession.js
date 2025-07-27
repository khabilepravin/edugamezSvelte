/**
 * User Session Store
 * Manages user authentication state and profile data
 */

import { writable } from 'svelte/store';

// Initial session state
const initialSession = {
  user: null,
  isAuthenticated: false,
  userSubscriptionLevel: null,
  userRole: null,
  displayName: null,
  isLoading: true
};

// Create the writable store
export const userSession = writable(initialSession);

// Helper functions to update the session
export const sessionActions = {
  // Set user authentication data
  setUser: (user) => {
    userSession.update(session => ({
      ...session,
      user,
      isAuthenticated: !!user,
      isLoading: false
    }));
  },

  // Set user profile data
  setProfile: (profile) => {
    userSession.update(session => ({
      ...session,
      userSubscriptionLevel: profile.userSubscriptionLevel || session.userSubscriptionLevel,
      userRole: profile.userRole || session.userRole,
      displayName: profile.displayName || session.displayName
    }));
  },

  // Set subscription level specifically
  setSubscriptionLevel: (level) => {
    userSession.update(session => ({
      ...session,
      userSubscriptionLevel: level
    }));
  },

  // Clear session data
  clearSession: () => {
    userSession.set(initialSession);
  },

  // Set loading state
  setLoading: (isLoading) => {
    userSession.update(session => ({
      ...session,
      isLoading
    }));
  },

  // Update session with complete profile data
  updateSession: (updates) => {
    userSession.update(session => ({
      ...session,
      ...updates
    }));
  }
};

// Derived stores for specific data
import { derived } from 'svelte/store';

export const isAuthenticated = derived(
  userSession,
  $session => $session.isAuthenticated
);

export const userSubscriptionLevel = derived(
  userSession,
  $session => $session.userSubscriptionLevel
);

export const currentUser = derived(
  userSession,
  $session => $session.user
);

export const isLoading = derived(
  userSession,
  $session => $session.isLoading
);

// Helper function to check if user has pro subscription
export const hasProSubscription = derived(
  userSession,
  $session => $session.userSubscriptionLevel === 'pro'
);
