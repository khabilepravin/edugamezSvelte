/**
 * Subscription utilities
 * Helper functions for subscription-related checks and operations
 */

import { get } from 'svelte/store';
import { userSession } from './userSession.js';

/**
 * Check if the current user has a specific subscription level
 * @param {string} level - The subscription level to check for
 * @returns {boolean} - True if user has the specified level or higher
 */
export function hasSubscriptionLevel(level) {
  const session = get(userSession);
  const currentLevel = session.userSubscriptionLevel;
  
  if (!currentLevel) return false;
  
  // Define subscription hierarchy
  const levels = {
    'free': 0,
    'basic': 1,
    'pro': 2,
    'premium': 3
  };
  
  const currentLevelValue = levels[currentLevel.toLowerCase()] || 0;
  const requiredLevelValue = levels[level.toLowerCase()] || 0;
  
  return currentLevelValue >= requiredLevelValue;
}

/**
 * Check if the current user is a pro subscriber
 * @returns {boolean} - True if user has pro subscription or higher
 */
export function isPro() {
  return hasSubscriptionLevel('pro');
}

/**
 * Check if the current user is authenticated
 * @returns {boolean} - True if user is authenticated
 */
export function isAuthenticated() {
  const session = get(userSession);
  return session.isAuthenticated;
}

/**
 * Get the current user's subscription level
 * @returns {string|null} - The user's subscription level or null
 */
export function getSubscriptionLevel() {
  const session = get(userSession);
  return session.userSubscriptionLevel;
}

/**
 * Get the current user's role
 * @returns {string|null} - The user's role or null
 */
export function getUserRole() {
  const session = get(userSession);
  return session.userRole;
}

/**
 * Get the current user's display name
 * @returns {string|null} - The user's display name or null
 */
export function getDisplayName() {
  const session = get(userSession);
  return session.displayName;
}

/**
 * Check if a feature is available for the current user's subscription level
 * @param {string} feature - The feature name
 * @returns {boolean} - True if the feature is available
 */
export function hasFeatureAccess(feature) {
  const featureRequirements = {
    'basic_spelling': 'free',
    'advanced_spelling': 'basic',
    'custom_lists': 'pro',
    'detailed_analytics': 'pro',
    'unlimited_tests': 'pro',
    'export_results': 'pro',
    'teacher_dashboard': 'pro',
    'bulk_student_management': 'premium'
  };
  
  const requiredLevel = featureRequirements[feature];
  if (!requiredLevel) return true; // Feature doesn't require subscription
  
  return hasSubscriptionLevel(requiredLevel);
}

/**
 * Get subscription level display information
 * @param {string} level - The subscription level
 * @returns {object} - Display information for the level
 */
export function getSubscriptionDisplayInfo(level) {
  const levelInfo = {
    'free': {
      name: 'Free',
      color: 'gray',
      badge: 'FREE',
      description: 'Basic features included'
    },
    'basic': {
      name: 'Basic',
      color: 'blue',
      badge: 'BASIC',
      description: 'Enhanced learning experience'
    },
    'pro': {
      name: 'Pro',
      color: 'green',
      badge: 'PRO',
      description: 'Full access to all features'
    },
    'premium': {
      name: 'Premium',
      color: 'purple',
      badge: 'PREMIUM',
      description: 'Advanced tools and analytics'
    }
  };
  
  return levelInfo[level?.toLowerCase()] || levelInfo['free'];
}
