/**
 * Payment API Integration - Main Export File
 * This file exports all payment-related functions and types
 */

// Export types and interfaces
export type {
  PaymentPlan,
  PaymentIntentResponse,
  SubscriptionResponse,
  CreatePaymentIntentRequest,
  UpdateSubscriptionRequest
} from './stripe';

// Export Stripe API functions
export {
  createPaymentIntent,
  updateUserSubscription,
  getUserSubscription,
  cancelSubscription,
  getPaymentHistory
} from './stripe';

// Export plan configuration and utilities
export {
  PAYMENT_PLANS,
  getPlanById,
  getAllPlans,
  getPopularPlan,
  calculateTotalPrice,
  isValidPlan
} from './plans';

// Export utility functions
export {
  formatCurrency,
  formatPaymentDate,
  getPaymentStatusColor,
  isValidEmail,
  generateTransactionRef,
  calculateSubscriptionEndDate,
  isSubscriptionActive,
  getDaysUntilExpiration,
  formatPlanFeatures,
  sanitizePaymentMetadata,
  createPaymentErrorMessage
} from './utils';

// Export test utilities (for development/testing)
export {
  testPaymentIntegration,
  validatePaymentConfig,
  formatTestAmount,
  createTestMetadata
} from './test';
