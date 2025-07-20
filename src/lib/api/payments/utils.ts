/**
 * Payment utilities and helper functions
 */

/**
 * Format currency amount for display
 * @param amount - Amount in dollars
 * @param currency - Currency code (default: USD)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Format date for payment history
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export function formatPaymentDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
}

/**
 * Get payment status badge color
 * @param status - Payment status
 * @returns CSS classes for status badge
 */
export function getPaymentStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'succeeded':
    case 'paid':
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'pending':
    case 'processing':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'failed':
    case 'cancelled':
    case 'canceled':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'refunded':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

/**
 * Validate email format
 * @param email - Email string to validate
 * @returns boolean indicating if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate a unique transaction reference
 * @returns Unique transaction reference string
 */
export function generateTransactionRef(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `TXN_${timestamp}_${randomStr}`.toUpperCase();
}

/**
 * Calculate subscription end date
 * @param startDate - Subscription start date
 * @param planDuration - Duration in months (default: 1)
 * @returns End date of subscription
 */
export function calculateSubscriptionEndDate(
  startDate: Date, 
  planDuration: number = 1
): Date {
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + planDuration);
  return endDate;
}

/**
 * Check if subscription is active
 * @param endDate - Subscription end date
 * @returns boolean indicating if subscription is still active
 */
export function isSubscriptionActive(endDate: string | Date): boolean {
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  return end > new Date();
}

/**
 * Get days until subscription expires
 * @param endDate - Subscription end date
 * @returns Number of days until expiration (negative if expired)
 */
export function getDaysUntilExpiration(endDate: string | Date): number {
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Format plan features for display
 * @param features - Array of feature strings
 * @returns Formatted features with proper capitalization
 */
export function formatPlanFeatures(features: string[]): string[] {
  return features.map(feature => {
    // Ensure first letter is capitalized
    return feature.charAt(0).toUpperCase() + feature.slice(1);
  });
}

/**
 * Sanitize payment metadata
 * @param metadata - Raw metadata object
 * @returns Sanitized metadata object
 */
export function sanitizePaymentMetadata(metadata: Record<string, any>): Record<string, string> {
  const sanitized: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(metadata)) {
    // Only include string values and convert others to strings
    if (typeof value === 'string') {
      sanitized[key] = value;
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      sanitized[key] = String(value);
    }
    // Skip undefined, null, objects, arrays, etc.
  }
  
  return sanitized;
}

/**
 * Create error message for payment failures
 * @param error - Error object or string
 * @returns User-friendly error message
 */
export function createPaymentErrorMessage(error: any): string {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.message) {
    // Common Stripe error messages that need user-friendly translations
    const message = error.message.toLowerCase();
    
    if (message.includes('card_declined')) {
      return 'Your card was declined. Please try a different payment method.';
    }
    if (message.includes('insufficient_funds')) {
      return 'Insufficient funds. Please check your account balance.';
    }
    if (message.includes('expired_card')) {
      return 'Your card has expired. Please use a different card.';
    }
    if (message.includes('incorrect_cvc')) {
      return 'The security code is incorrect. Please check and try again.';
    }
    if (message.includes('processing_error')) {
      return 'There was a processing error. Please try again in a few minutes.';
    }
    
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
}
