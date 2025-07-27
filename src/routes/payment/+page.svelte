<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { createClient } from "@supabase/supabase-js";
  import { loadStripe } from '@stripe/stripe-js';
  import Loading from '$lib/components/loading.svelte';
  import { 
    createPaymentIntent, 
    updateUserSubscription, 
    getAllPlans,
    formatCurrency,
    createPaymentErrorMessage
  } from '$lib/api/payments';
  import { createUserProfileByUserId } from '$lib/api/userProfiles';
  import { sessionActions } from '$lib/store/userSession.js';

  let user = null;
  let isLoading = true;
  let stripe = null;
  let elements = null;
  let paymentElement = null;
  let paymentError = null;
  let isProcessing = false;
  let paymentSuccess = false;
  let selectedPlan = null;
  let clientSecret = null;
  let showPaymentForm = false;

  // Get payment plans from the API configuration
  const plans = getAllPlans();

  const supabase = createClient(import.meta.env.VITE_ENV_supabaseUrl, import.meta.env.VITE_ENV_supabasekey);

  onMount(async () => {
    // Check if user is authenticated
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (!currentUser) {
      goto(`/auth/login?redirectTo=${$page.url.pathname}`);
      return;
    }

    user = currentUser;
    
    // Initialize Stripe with better error handling
    try {
      const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
      console.log('🔑 Stripe key check:', {
        hasKey: !!stripeKey,
        keyLength: stripeKey?.length || 0,
        keyPrefix: stripeKey?.substring(0, 7) || 'None'
      });
      
      if (!stripeKey) {
        console.error('❌ VITE_STRIPE_PUBLISHABLE_KEY is not set');
        paymentError = 'Payment system is not configured. Please contact support.';
        isLoading = false;
        return;
      }

      if (!stripeKey.startsWith('pk_')) {
        console.error('❌ Invalid Stripe publishable key format');
        paymentError = 'Invalid payment system configuration. Please contact support.';
        isLoading = false;
        return;
      }
      
      console.log('🔄 Loading Stripe with key:', stripeKey.substring(0, 20) + '...');
      stripe = await loadStripe(stripeKey);
      console.log('✅ Stripe loaded successfully:', !!stripe);
      
      if (!stripe) {
        throw new Error('Failed to load Stripe - loadStripe returned null');
      }

      console.log('🎉 Stripe initialization complete:', {
        stripeLoaded: !!stripe,
        stripeType: typeof stripe,
        hasCreatePaymentMethod: typeof stripe.createPaymentMethod === 'function'
      });
      
    } catch (error) {
      console.error('❌ Error loading Stripe:', error);
      paymentError = 'Failed to load payment system. Please refresh the page.';
    }
    
    isLoading = false;
  });

  async function selectPlan(plan) {
    // Prevent multiple selections while processing
    if (isProcessing) {
      console.log('⏳ Already processing, ignoring plan selection');
      return;
    }

    selectedPlan = plan;
    paymentError = null;
    paymentSuccess = false;
    showPaymentForm = true;
    
    // Reset previous payment elements
    if (paymentElement) {
      console.log('🧹 Cleaning up previous payment element');
      paymentElement.unmount();
      paymentElement = null;
    }
    if (elements) {
      elements = null;
    }
    clientSecret = null;
    
    // Create new payment intent for the selected plan
    await createPaymentIntentForPlan(plan);
  }

  async function createPaymentIntentForPlan(plan) {
    try {
      isProcessing = true;
      console.log('💳 Creating payment intent for plan:', plan.name);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('Authentication required');
      }

      // Log environment variables for debugging
      console.log('🔍 Environment check:', {
        hasApiUrl: !!import.meta.env.VITE_ENV_apiBaseUrl,
        hasStripeKey: !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
        apiUrl: import.meta.env.VITE_ENV_apiBaseUrl?.substring(0, 30) + '...',
        stripeKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.substring(0, 20) + '...'
      });

      // Use the new API integration
      const response = await createPaymentIntent(
        {
          planId: plan.id,
          amount: plan.price,
          currency: 'usd',
          description: `${plan.name} - ${plan.description}`,
          customerEmail: user.email,
          metadata: {
            userId: user.id,
            userEmail: user.email,
            planName: plan.name,
            planId: plan.id
          }
        },
        session.access_token
      );

      console.log('📝 Payment intent response:', { 
        success: response.success, 
        hasClientSecret: !!response.client_secret,
        error: response.error,
        responseKeys: Object.keys(response),
        clientSecretLength: response.client_secret?.length || 0
      });

      if (!response.success) {
        console.error('❌ Payment intent creation failed:', response);
        throw new Error(response.error || 'Failed to create payment intent');
      }

      if (!response.client_secret) {
        console.error('❌ No client secret in response:', response);
        throw new Error('No client secret received from payment API');
      }

      clientSecret = response.client_secret;
      console.log('🔐 Client secret received:', !!clientSecret);
      
      // Initialize Payment Element with the client secret
      if (stripe && clientSecret) {
        console.log('🎨 Creating Stripe elements with:', {
          hasStripe: !!stripe,
          hasClientSecret: !!clientSecret,
          clientSecretLength: clientSecret.length
        });
        
        elements = stripe.elements({
          clientSecret: clientSecret,
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary: '#2563eb',
              colorBackground: '#ffffff',
              colorText: '#1f2937',
              colorDanger: '#dc2626',
              fontFamily: 'system-ui, sans-serif',
              spacingUnit: '4px',
              borderRadius: '8px'
            }
          }
        });

        console.log('💅 Elements created, creating payment element...');
        
        paymentElement = elements.create('payment', {
          layout: 'tabs'
        });

        console.log('🔧 Payment element created, attempting to mount...');

        // Add a small delay to ensure DOM is ready
        setTimeout(() => {
          const mountElement = document.getElementById('payment-element');
          console.log('🎯 Mount target element found:', !!mountElement);
          
          if (mountElement) {
            paymentElement.mount('#payment-element');
            console.log('✅ Payment element mounted successfully');
            
            paymentElement.on('change', (event) => {
              if (event.error) {
                console.log('❌ Payment element error:', event.error.message);
                paymentError = event.error.message;
              } else {
                console.log('✅ Payment element validation passed');
                paymentError = null;
              }
            });
            
            paymentElement.on('ready', () => {
              console.log('🎉 Payment element is ready for input');
            });
            
          } else {
            console.error('❌ Payment element mount target not found');
            paymentError = 'Payment form could not be initialized. Please refresh the page.';
          }
        }, 100);
        
      } else {
        console.error('❌ Missing requirements for payment element:', { 
          stripe: !!stripe, 
          clientSecret: !!clientSecret,
          stripeType: typeof stripe,
          clientSecretType: typeof clientSecret
        });
        throw new Error(`Failed to initialize payment form - Missing: ${!stripe ? 'Stripe' : ''} ${!clientSecret ? 'Client Secret' : ''}`);
      }
      
    } catch (error) {
      console.error('❌ Error creating payment intent:', error);
      paymentError = createPaymentErrorMessage(error);
    } finally {
      isProcessing = false;
    }
  }

  async function handleSubmit() {
    if (!selectedPlan || !paymentElement || !stripe) {
      console.log('❌ Missing required components for payment submission');
      return;
    }

    if (isProcessing) {
      console.log('⏳ Payment already being processed, ignoring duplicate submission');
      return;
    }

    isProcessing = true;
    paymentError = null;

    try {
      console.log('💳 Confirming payment with Stripe...', {
        hasStripe: !!stripe,
        hasElements: !!elements,
        hasPaymentElement: !!paymentElement,
        clientSecretLength: clientSecret?.length || 0
      });
      
      // Confirm payment with Stripe (this handles the entire payment flow)
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success?plan=${selectedPlan.id}`,
        },
        redirect: 'if_required'
      });

      console.log('📋 Stripe confirmation result:', {
        hasError: !!error,
        errorType: error?.type,
        errorCode: error?.code
      });

      if (error) {
        // Payment failed
        console.error('❌ Stripe payment failed:', error);
        
        // Handle specific error types
        if (error.type === 'invalid_request_error' && error.code === 'payment_intent_unexpected_state') {
          paymentError = 'This payment has already been processed or expired. Please select your plan again to create a new payment.';
          // Reset the form to allow user to try again
          showPaymentForm = false;
          selectedPlan = null;
          clientSecret = null;
          if (paymentElement) {
            paymentElement.unmount();
            paymentElement = null;
          }
          elements = null;
        } else {
          paymentError = createPaymentErrorMessage(error);
        }
      } else {
        // Payment succeeded - Stripe has handled everything
        console.log('✅ Stripe payment confirmation completed successfully');
        
        // Optional: Verify payment status with backend
        await verifyPaymentStatus();
        
        // Show success state
        paymentSuccess = true;
        
        // Reset form
        selectedPlan = null;
        showPaymentForm = false;
        
        // Redirect to success page after a short delay
        setTimeout(() => {
          goto(`/payment/success?plan=${selectedPlan?.id || 'unknown'}`);
        }, 2000);
      }
      
    } catch (error) {
      console.error('❌ Payment Error:', error);
      paymentError = createPaymentErrorMessage(error);
    } finally {
      isProcessing = false;
    }
  }

  async function verifyPaymentStatus() {
    try {
      console.log('🔍 Verifying payment status...');
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        console.log('⚠️ No session for status verification, skipping...');
        return;
      }

      const apiBaseUrl = import.meta.env.VITE_ENV_apiBaseUrl;
      
      if (!apiBaseUrl) {
        console.log('⚠️ No API base URL for status verification, skipping...');
        return;
      }

      // Extract payment intent ID from client secret
      const paymentIntentId = clientSecret?.split('_secret_')[0];
      
      if (!paymentIntentId) {
        console.log('⚠️ Could not extract payment intent ID, skipping verification...');
        return;
      }

      console.log('📞 Checking payment status for:', paymentIntentId);

      const response = await fetch(`${apiBaseUrl}/payments/payment-intent/${paymentIntentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const status = await response.json();
        console.log('✅ Payment status verified:', status);
        
        if (status.status === 'succeeded') {
          console.log('🎉 Payment confirmed as succeeded on backend');
          
          // Update user profile to pro subscription level
          await updateUserProfileToPro();
        } else {
          console.log('⚠️ Payment status is not succeeded:', status.status);
        }
      } else {
        console.log('⚠️ Could not verify payment status:', response.status);
      }
      
    } catch (error) {
      console.log('⚠️ Payment status verification failed (non-critical):', error);
      // This is optional verification, so we don't throw the error
    }
  }

  async function updateUserProfileToPro() {
    try {
      console.log('🔄 Updating user profile to pro subscription...');
      
      if (!user?.id) {
        console.log('⚠️ No user ID available for profile update');
        return;
      }

      // Get current session for auth token
      const { data: { session } } = await supabase.auth.getSession();
      const authToken = session?.access_token;

      // Prepare user profile data
      const profileData = {
        userId: user.id,
        userRole: user.user_metadata?.role || 'student', // Use existing role or default to student
        displayName: user.user_metadata?.display_name || user.email?.split('@')[0] || 'User',
        userSubscriptionLevel: 'pro' // Set to pro after successful payment
      };

      console.log('📝 Profile data to send:', profileData);

      // Call the userProfiles API
      const response = await createUserProfileByUserId(profileData, authToken);

      if (response.success) {
        console.log('✅ User profile updated to pro successfully:', response.data);
        
        // Update session store with new subscription level
        sessionActions.setSubscriptionLevel('pro');
      } else {
        console.error('❌ Failed to update user profile:', response.error);
        // Log error but don't fail the payment flow
      }

    } catch (error) {
      console.error('❌ Error updating user profile to pro:', error);
      // Log error but don't fail the payment flow since payment was successful
    }
  }

  function resetPaymentForm() {
    console.log('🧹 Resetting payment form');
    
    // Clean up payment elements
    if (paymentElement) {
      try {
        paymentElement.unmount();
      } catch (error) {
        console.log('Payment element already unmounted:', error);
      }
      paymentElement = null;
    }
    
    // Reset state
    elements = null;
    clientSecret = null;
    selectedPlan = null;
    showPaymentForm = false;
    paymentError = null;
    paymentSuccess = false;
    isProcessing = false;
  }

  function goBack() {
    goto('/');
  }

  // Debug function to check Stripe status
  function checkStripeStatus() {
    console.log('🔍 Debugging Stripe Status:');
    console.log('- Stripe loaded:', !!stripe);
    console.log('- Stripe type:', typeof stripe);
    console.log('- Client secret:', !!clientSecret);
    console.log('- Client secret type:', typeof clientSecret);
    console.log('- Client secret length:', clientSecret?.length || 0);
    console.log('- Elements created:', !!elements);
    console.log('- Payment element created:', !!paymentElement);
    console.log('- Selected plan:', selectedPlan?.name);
    console.log('- Is processing:', isProcessing);
    console.log('- Payment error:', paymentError);
    
    const mountElement = document.getElementById('payment-element');
    console.log('- Mount element exists:', !!mountElement);
    console.log('- Mount element innerHTML:', mountElement?.innerHTML?.length || 0, 'characters');
    console.log('- Mount element classes:', mountElement?.className || 'none');
    
    // Check environment variables
    console.log('🌍 Environment Variables:');
    console.log('- API Base URL:', import.meta.env.VITE_ENV_apiBaseUrl ? 'Set' : 'Missing');
    console.log('- Stripe Key:', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? 'Set' : 'Missing');
    console.log('- Supabase URL:', import.meta.env.VITE_ENV_supabaseUrl ? 'Set' : 'Missing');
    console.log('- Supabase Key:', import.meta.env.VITE_ENV_supabasekey ? 'Set' : 'Missing');
    
    // Check user state
    console.log('👤 User State:');
    console.log('- User loaded:', !!user);
    console.log('- User email:', user?.email || 'N/A');
    console.log('- Show payment form:', showPaymentForm);
    
    // If error, try to provide specific guidance
    if (!stripe) {
      console.log('💡 Guidance: Stripe not loaded - check VITE_STRIPE_PUBLISHABLE_KEY');
    } else if (!clientSecret) {
      console.log('💡 Guidance: No client secret - check API connection and authentication');
    } else if (!paymentElement) {
      console.log('💡 Guidance: Payment element not created - check Stripe Elements initialization');
    } else {
      console.log('✅ All components seem to be initialized correctly');
    }
  }

  // Debug function to test API call directly
  async function testApiCall() {
    console.log('🧪 Testing API call directly...');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        console.log('❌ No valid session found');
        return;
      }

      const testPlan = plans[0]; // Use first plan for testing
      console.log('📞 Making API call with:', {
        planId: testPlan.id,
        amount: testPlan.price,
        email: user?.email
      });

      const response = await createPaymentIntent(
        {
          planId: testPlan.id,
          amount: testPlan.price,
          currency: 'usd',
          description: `Test payment for ${testPlan.name}`,
          customerEmail: user?.email,
          metadata: {
            userId: user?.id,
            test: 'true'
          }
        },
        session.access_token
      );

      console.log('✅ API Response received:', response);
      console.log('🔍 Response analysis:', {
        success: response.success,
        hasClientSecret: !!response.client_secret,
        clientSecretFormat: response.client_secret?.substring(0, 10) + '...',
        error: response.error,
        allKeys: Object.keys(response)
      });

    } catch (error) {
      console.error('❌ API test failed:', error);
    }
  }

  // Make these functions available globally for console access
  if (typeof window !== 'undefined') {
    window.checkStripeStatus = checkStripeStatus;
    window.testApiCall = testApiCall;
  }
</script>

<svelte:head>
  <title>Payment - EduGamez</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <button
        class="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
        on:click={goBack}
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </button>
      
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Choose Your Plan</h1>
      <p class="text-gray-600">Select a plan and complete your payment securely</p>
    </div>

    {#if isLoading}
      <div class="flex justify-center items-center py-12">
        <Loading />
      </div>
    {:else}
      <!-- Success Message -->
      {#if paymentSuccess}
        <div class="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div class="flex items-center mb-4">
            <svg class="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-lg font-semibold text-green-800">Payment Successful!</h3>
          </div>
          <p class="text-green-700 mb-4">Thank you for your purchase. Your account has been upgraded successfully.</p>
          <button
            class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
            on:click={() => goto('/dashboard')}
          >
            Go to Dashboard
          </button>
        </div>
      {/if}

      <!-- Payment Plans -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {#each plans as plan}
          <div class="relative">
            {#if plan.popular}
              <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span class="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            {/if}
            
            <div class="bg-white rounded-lg shadow-lg border-2 p-6 h-full flex flex-col
              {selectedPlan?.id === plan.id ? 'border-blue-500' : 'border-gray-200'}
              {plan.popular ? 'border-blue-300' : ''}">
              
              <div class="text-center mb-6">
                <h3 class="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                <div class="text-3xl font-bold text-gray-900 mb-2">
                  {formatCurrency(plan.price)}
                  <span class="text-sm text-gray-600 font-normal">one-time</span>
                </div>
                <p class="text-gray-600 text-sm">{plan.description}</p>
              </div>

              <ul class="space-y-3 mb-6 flex-grow">
                {#each plan.features as feature}
                  <li class="flex items-center">
                    <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-gray-700">{feature}</span>
                  </li>
                {/each}
              </ul>

              <button
                class="w-full py-3 px-4 rounded-lg font-medium transition-colors mt-auto
                  {selectedPlan?.id === plan.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'}"
                on:click={() => selectPlan(plan)}
                disabled={isProcessing}
              >
                {selectedPlan?.id === plan.id ? 'Selected' : 'Choose Plan'}
              </button>
            </div>
          </div>
        {/each}
      </div>

      <!-- Payment Form -->
      {#if showPaymentForm && selectedPlan}
        <div class="bg-white rounded-lg shadow-lg p-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Complete Your Purchase</h2>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Order Summary -->
            <div>
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
              <div class="bg-gray-50 rounded-lg p-6">
                <div class="flex justify-between items-center mb-4">
                  <div>
                    <h4 class="font-semibold text-gray-800">{selectedPlan.name}</h4>
                    <p class="text-sm text-gray-600">{selectedPlan.description}</p>
                  </div>
                  <span class="font-semibold text-lg">{formatCurrency(selectedPlan.price)}</span>
                </div>
                
                <div class="border-t border-gray-200 pt-4">
                  <div class="space-y-2 mb-4">
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">Subtotal:</span>
                      <span>{formatCurrency(selectedPlan.price)}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">Tax:</span>
                      <span>{formatCurrency(0)}</span>
                    </div>
                  </div>
                  <div class="flex justify-between items-center font-bold text-lg border-t border-gray-200 pt-4">
                    <span>Total:</span>
                    <span>{formatCurrency(selectedPlan.price)}</span>
                  </div>
                </div>
              </div>

              <!-- Customer Information -->
              <div class="mt-6">
                <h4 class="text-md font-semibold text-gray-800 mb-3">Customer Information</h4>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-sm text-gray-700">
                    <span class="font-medium">Email:</span> {user?.email}
                  </p>
                  <p class="text-sm text-gray-700 mt-1">
                    <span class="font-medium">Name:</span> {user?.user_metadata?.full_name || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>

            <!-- Payment Form -->
            <div>
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Payment Information</h3>
              
              <form on:submit|preventDefault={handleSubmit} class="space-y-6">
                {#if isProcessing && !paymentElement}
                  <div class="flex items-center justify-center py-8">
                    <div class="flex items-center space-x-2">
                      <svg class="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span class="text-gray-600">Setting up payment form...</span>
                    </div>
                  </div>
                {:else}
                  <div>
                    <div class="flex items-center justify-between mb-3">
                      <div class="block text-sm font-medium text-gray-700">
                        Payment Details
                      </div>
                      <!-- Debug button - remove in production -->
                      <button 
                        type="button" 
                        class="text-xs text-gray-500 hover:text-gray-700"
                        on:click={checkStripeStatus}
                      >
                        Debug Info
                      </button>
                    </div>
                    
                    <!-- Show environment info -->
                    {#if !import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY}
                      <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <p class="text-red-700 text-sm">
                          ⚠️ Stripe publishable key is not configured. Please set VITE_STRIPE_PUBLISHABLE_KEY environment variable.
                        </p>
                      </div>
                    {/if}
                    
                    <div id="payment-element" class="bg-white min-h-[200px] border border-gray-200 rounded-lg p-4">
                      <!-- Stripe Payment Element will be mounted here -->
                      {#if !stripe}
                        <div class="flex items-center justify-center h-32">
                          <div class="text-center text-gray-500">
                            <svg class="animate-spin h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p class="text-sm">Loading payment system...</p>
                          </div>
                        </div>
                      {:else if !clientSecret}
                        <div class="flex items-center justify-center h-32">
                          <div class="text-center text-gray-500">
                            <svg class="animate-spin h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 74 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p class="text-sm">Preparing payment form...</p>
                          </div>
                        </div>
                      {:else if !paymentElement}
                        <div class="flex items-center justify-center h-32">
                          <div class="text-center text-gray-500">
                            <svg class="animate-spin h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p class="text-sm">Initializing payment form...</p>
                          </div>
                        </div>
                      {/if}
                    </div>
                  </div>

                  {#if paymentError}
                    <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div class="flex items-center">
                        <svg class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <p class="text-red-700 text-sm">{paymentError}</p>
                      </div>
                    </div>
                  {/if}

                  <div class="flex space-x-4">
                    <button
                      type="button"
                      class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
                      on:click={resetPaymentForm}
                    >
                      Back to Plans
                    </button>
                    
                    <button
                      type="submit"
                      class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isProcessing || !paymentElement}
                    >
                      {#if isProcessing}
                        <span class="flex items-center justify-center">
                          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      {:else}
                        Complete Payment • {formatCurrency(selectedPlan.price)}
                      {/if}
                    </button>
                  </div>
                {/if}
              </form>
            </div>
          </div>

          <!-- Security Notice -->
          <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-start">
              <svg class="w-6 h-6 text-blue-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <h4 class="font-medium text-blue-800 mb-1">Secure Payment Processing</h4>
                <p class="text-blue-700 text-sm">
                  Your payment information is encrypted and processed securely by Stripe. 
                  We never store your card details on our servers. All transactions are protected by industry-standard security measures.
                </p>
              </div>
            </div>
          </div>
        </div>
      {/if}
    {/if}
  </div>
</div>
