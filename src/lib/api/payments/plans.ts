/**
 * Payment Plans Configuration
 * Centralized configuration for all payment plans
 */

import type { PaymentPlan } from './stripe';

export const PAYMENT_PLANS: PaymentPlan[] = [
  {
    id: 'free',
    name: 'Basic (Free)',
    price: 0,
    description: 'Get started with limited spelling practice',
    features: [
      '1 practice test only',
      'Basic spelling exercises',
      'Limited word lists',
      'Basic progress tracking'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    description: 'Unlimited access to all spelling features',
    features: [
      'Unlimited practice tests',
      'Create custom spelling practice lists',
      'Advanced spelling exercises',
      'Detailed progress analytics',
      'Priority support',
      'Export test results'
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
