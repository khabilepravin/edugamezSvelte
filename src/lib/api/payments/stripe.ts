/**
 * Stripe Payment API Integration
 * This file contains all the Stripe-related API calls to the external payment service
 */

// Payment plan types
export interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
}

// Payment intent response
export interface PaymentIntentResponse {
  success: boolean;
  client_secret?: string;
  payment_intent_id?: string;
  error?: string;
}

// Subscription update response
export interface SubscriptionResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Payment method for creating payment intent
export interface CreatePaymentIntentRequest {
  planId: string;
  amount: number;
  currency?: string;
  description?: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
}

// Update subscription request
export interface UpdateSubscriptionRequest {
  planId: string;
  amount: number;
  paymentIntentId?: string;
  metadata?: Record<string, string>;
}

/**
 * Create a payment intent for the selected plan
 * @param request - Payment intent creation data
 * @param authToken - User authentication token
 * @returns Promise containing the payment intent response
 */
export async function createPaymentIntent(
  request: CreatePaymentIntentRequest,
  authToken: string
): Promise<PaymentIntentResponse> {
  try {
    const apiBaseUrl = import.meta.env.VITE_ENV_apiBaseUrl;
    
    if (!apiBaseUrl) {
      throw new Error('API base URL not configured');
    }

    const response = await fetch(`${apiBaseUrl}/payments/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        amount: Math.round(request.amount * 100), // Convert to cents for Stripe
        currency: request.currency || 'usd',
        description: request.description || `Payment for ${request.planId} plan`,
        customerEmail: request.customerEmail,
        metadata: request.metadata || {}
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error || 
        errorData?.message || 
        `Failed to create payment intent: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log('🔍 API Response data:', { 
      hasClientSecret: !!(data.client_secret || data.clientSecret),
      hasPaymentIntentId: !!(data.payment_intent_id || data.paymentIntentId),
      keys: Object.keys(data)
    });
    
    // Handle both snake_case and camelCase response formats
    const clientSecret = data.client_secret || data.clientSecret;
    const paymentIntentId = data.payment_intent_id || data.paymentIntentId;
    
    if (!clientSecret) {
      console.error('❌ No client secret in response:', data);
      throw new Error('No client secret received from payment API');
    }
    
    return {
      success: true,
      client_secret: clientSecret,
      payment_intent_id: paymentIntentId
    };

  } catch (error) {
    console.error('Error creating payment intent:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Update user subscription after successful payment
 * @param request - Subscription update data
 * @param authToken - User authentication token
 * @returns Promise containing the subscription update response
 */
export async function updateUserSubscription(
  request: UpdateSubscriptionRequest,
  authToken: string
): Promise<SubscriptionResponse> {
  try {
    const apiBaseUrl = import.meta.env.VITE_ENV_apiBaseUrl;
    
    if (!apiBaseUrl) {
      throw new Error('API base URL not configured');
    }

    const response = await fetch(`${apiBaseUrl}/payments/update-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        planId: request.planId,
        amount: request.amount,
        paymentIntentId: request.paymentIntentId,
        metadata: request.metadata || {}
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error || 
        errorData?.message || 
        `Failed to update subscription: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || 'Subscription updated successfully'
    };

  } catch (error) {
    console.error('Error updating subscription:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Get user's current subscription details
 * @param authToken - User authentication token
 * @returns Promise containing subscription details
 */
export async function getUserSubscription(authToken: string) {
  try {
    const apiBaseUrl = import.meta.env.VITE_ENV_apiBaseUrl;
    
    if (!apiBaseUrl) {
      throw new Error('API base URL not configured');
    }

    const response = await fetch(`${apiBaseUrl}/payments/subscription`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error || 
        errorData?.message || 
        `Failed to get subscription: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();

  } catch (error) {
    console.error('Error getting subscription:', error);
    throw error;
  }
}

/**
 * Cancel user subscription
 * @param authToken - User authentication token
 * @returns Promise containing cancellation response
 */
export async function cancelSubscription(authToken: string): Promise<SubscriptionResponse> {
  try {
    const apiBaseUrl = import.meta.env.VITE_ENV_apiBaseUrl;
    
    if (!apiBaseUrl) {
      throw new Error('API base URL not configured');
    }

    const response = await fetch(`${apiBaseUrl}/payments/cancel-subscription`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error || 
        errorData?.message || 
        `Failed to cancel subscription: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || 'Subscription cancelled successfully'
    };

  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Get payment history for the user
 * @param authToken - User authentication token
 * @returns Promise containing payment history
 */
export async function getPaymentHistory(authToken: string) {
  try {
    const apiBaseUrl = import.meta.env.VITE_ENV_apiBaseUrl;
    
    if (!apiBaseUrl) {
      throw new Error('API base URL not configured');
    }

    const response = await fetch(`${apiBaseUrl}/payments/history`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error || 
        errorData?.message || 
        `Failed to get payment history: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();

  } catch (error) {
    console.error('Error getting payment history:', error);
    throw error;
  }
}
