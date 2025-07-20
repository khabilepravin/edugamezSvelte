<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { getPlanById, formatCurrency } from '$lib/api/payments';

  let planName = '';
  let planDetails = null;

  onMount(() => {
    const planId = $page.url.searchParams.get('plan');
    if (planId) {
      planDetails = getPlanById(planId);
      if (planDetails) {
        planName = planDetails.name;
      } else {
        planName = 'Your Plan';
      }
    } else {
      planName = 'Your Plan';
    }
  });

  function goToDashboard() {
    goto('/dashboard');
  }

  function goToHome() {
    goto('/');
  }
</script>

<svelte:head>
  <title>Payment Successful - EduGamez</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
  <div class="max-w-md w-full">
    <!-- Success Card -->
    <div class="bg-white rounded-2xl shadow-xl p-8 text-center">
      <!-- Success Icon -->
      <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <!-- Success Message -->
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
      <p class="text-gray-600 mb-6">
        Thank you for your purchase. Your {planName} has been activated successfully.
      </p>

      <!-- Plan Details -->
      {#if planDetails}
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 class="font-semibold text-gray-800 mb-1">{planDetails.name}</h3>
          <p class="text-sm text-gray-600 mb-2">{planDetails.description}</p>
          <p class="text-lg font-bold text-green-600">{formatCurrency(planDetails.price)}</p>
        </div>
      {/if}

      <!-- Next Steps -->
      <div class="text-left mb-6">
        <h3 class="font-semibold text-gray-800 mb-3">What's next?</h3>
        <ul class="space-y-2 text-sm text-gray-600">
          <li class="flex items-center">
            <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Access your dashboard to start using premium features
          </li>
          <li class="flex items-center">
            <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Check your email for a receipt and account details
          </li>
          <li class="flex items-center">
            <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Explore all the new features available to you
          </li>
        </ul>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-3">
        <button
          class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          on:click={goToDashboard}
        >
          Go to Dashboard
        </button>
        
        <button
          class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
          on:click={goToHome}
        >
          Back to Home
        </button>
      </div>
    </div>

    <!-- Contact Support -->
    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600">
        Need help? 
        <a href="/feedback" class="text-blue-600 hover:text-blue-800 font-medium">
          Contact Support
        </a>
      </p>
    </div>
  </div>
</div>
