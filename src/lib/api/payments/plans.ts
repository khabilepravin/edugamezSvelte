/**
 * Payment Plans Configuration
 * Centralized configuration for all payment plans
 */

import type { PaymentPlan } from './stripe';

export const PAYMENT_PLANS: PaymentPlan[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 9.99,
    description: 'Access to basic spelling tests and practice modes',
    features: [
      '50 spelling tests',
      'Basic practice mode',
      'Progress tracking',
      'Email support'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: 19.99,
    description: 'Full access to all features and unlimited tests',
    features: [
      'Unlimited spelling tests',
      'Practice & Exam modes',
      'Advanced analytics',
      'Priority support',
      'Custom test creation',
      'API access',
      'Advanced reporting'
    ],
    popular: true
  }
];

/**
 * Get a payment plan by ID
 * @param planId - The plan ID to find
 * @returns The payment plan or undefined if not found
 */
export function getPlanById(planId: string): PaymentPlan | undefined {
  return PAYMENT_PLANS.find(plan => plan.id === planId);
}

/**
 * Get all available payment plans
 * @returns Array of all payment plans
 */
export function getAllPlans(): PaymentPlan[] {
  return PAYMENT_PLANS;
}

/**
 * Get the most popular plan
 * @returns The plan marked as popular
 */
export function getPopularPlan(): PaymentPlan | undefined {
  return PAYMENT_PLANS.find(plan => plan.popular);
}

/**
 * Calculate total price including any applicable taxes
 * @param basePrice - The base price of the plan
 * @param taxRate - Tax rate (default 0 for now)
 * @returns Object with subtotal, tax, and total
 */
export function calculateTotalPrice(basePrice: number, taxRate: number = 0) {
  const subtotal = basePrice;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  
  return {
    subtotal: Number(subtotal.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    total: Number(total.toFixed(2))
  };
}

/**
 * Validate plan selection
 * @param planId - The plan ID to validate
 * @returns boolean indicating if the plan is valid
 */
export function isValidPlan(planId: string): boolean {
  return PAYMENT_PLANS.some(plan => plan.id === planId);
}
