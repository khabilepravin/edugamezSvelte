<script>
  import { onMount } from 'svelte';
  import { loadStripe } from '@stripe/stripe-js';
  import { validatePaymentConfig } from '$lib/api/payments';

  let configResults = null;
  let stripeInstance = null;
  let testResults = [];

  function addTestResult(test, status, message) {
    testResults = [...testResults, { test, status, message, timestamp: new Date().toLocaleTimeString() }];
  }

  onMount(async () => {
    addTestResult('Config Check', 'info', 'Starting configuration validation...');
    
    // Validate configuration
    configResults = validatePaymentConfig();
    
    if (configResults.allValid) {
      addTestResult('Config Check', 'success', 'All environment variables are configured');
    } else {
      addTestResult('Config Check', 'error', 'Some environment variables are missing');
    }

    // Test Stripe loading
    try {
      addTestResult('Stripe Load', 'info', 'Loading Stripe...');
      const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
      
      if (!stripeKey) {
        addTestResult('Stripe Load', 'error', 'VITE_STRIPE_PUBLISHABLE_KEY not found');
        return;
      }

      stripeInstance = await loadStripe(stripeKey);
      
      if (stripeInstance) {
        addTestResult('Stripe Load', 'success', 'Stripe loaded successfully');
      } else {
        addTestResult('Stripe Load', 'error', 'Stripe failed to load');
      }
    } catch (error) {
      addTestResult('Stripe Load', 'error', `Stripe load error: ${error.message}`);
    }
  });

  function getStatusColor(status) {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'error': return 'text-red-600 bg-red-50';
      case 'info': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  }

  function getStatusIcon(status) {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '⚪';
    }
  }
</script>

<svelte:head>
  <title>Payment System Test - EduGamez</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="max-w-4xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Payment System Test</h1>
      <p class="text-gray-600">This page helps validate your payment integration setup</p>
    </div>

    <!-- Configuration Status -->
    {#if configResults}
      <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Environment Configuration</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 rounded-lg {configResults.apiBaseUrl ? 'bg-green-50' : 'bg-red-50'}">
              <span class="font-medium">API Base URL</span>
              <span class="text-sm {configResults.apiBaseUrl ? 'text-green-600' : 'text-red-600'}">
                {configResults.apiBaseUrl ? '✅ Set' : '❌ Missing'}
              </span>
            </div>
            
            <div class="flex items-center justify-between p-3 rounded-lg {configResults.stripePublishableKey ? 'bg-green-50' : 'bg-red-50'}">
              <span class="font-medium">Stripe Publishable Key</span>
              <span class="text-sm {configResults.stripePublishableKey ? 'text-green-600' : 'text-red-600'}">
                {configResults.stripePublishableKey ? '✅ Set' : '❌ Missing'}
              </span>
            </div>
          </div>
          
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 rounded-lg {configResults.supabaseUrl ? 'bg-green-50' : 'bg-red-50'}">
              <span class="font-medium">Supabase URL</span>
              <span class="text-sm {configResults.supabaseUrl ? 'text-green-600' : 'text-red-600'}">
                {configResults.supabaseUrl ? '✅ Set' : '❌ Missing'}
              </span>
            </div>
            
            <div class="flex items-center justify-between p-3 rounded-lg {configResults.supabaseKey ? 'bg-green-50' : 'bg-red-50'}">
              <span class="font-medium">Supabase Key</span>
              <span class="text-sm {configResults.supabaseKey ? 'text-green-600' : 'text-red-600'}">
                {configResults.supabaseKey ? '✅ Set' : '❌ Missing'}
              </span>
            </div>
          </div>
        </div>

        <div class="mt-4 p-4 rounded-lg {configResults.allValid ? 'bg-green-50 border-l-4 border-green-400' : 'bg-red-50 border-l-4 border-red-400'}">
          <p class="font-medium {configResults.allValid ? 'text-green-800' : 'text-red-800'}">
            {configResults.allValid ? '✅ Configuration Complete' : '❌ Configuration Incomplete'}
          </p>
          <p class="text-sm {configResults.allValid ? 'text-green-700' : 'text-red-700'} mt-1">
            {configResults.allValid 
              ? 'All required environment variables are configured.' 
              : 'Please set the missing environment variables in your .env file.'}
          </p>
        </div>
      </div>
    {/if}

    <!-- Test Results -->
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Test Results</h2>
      
      {#if testResults.length === 0}
        <div class="text-center py-8">
          <div class="inline-flex items-center space-x-2">
            <svg class="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-gray-600">Running tests...</span>
          </div>
        </div>
      {:else}
        <div class="space-y-3">
          {#each testResults as result}
            <div class="flex items-start space-x-3 p-3 rounded-lg {getStatusColor(result.status)}">
              <span class="text-lg">{getStatusIcon(result.status)}</span>
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <span class="font-medium">{result.test}</span>
                  <span class="text-xs opacity-75">{result.timestamp}</span>
                </div>
                <p class="text-sm mt-1">{result.message}</p>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Navigation -->
    <div class="mt-8 flex space-x-4">
      <a href="/payment" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
        Go to Payment Page
      </a>
      <a href="/" class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
        Back to Home
      </a>
    </div>

    <!-- Debug Information -->
    <div class="mt-8 bg-gray-50 rounded-lg p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Debug Information</h3>
      <div class="grid grid-cols-1 gap-6 text-sm">
        <div>
          <strong class="text-gray-800">Environment Variables (Partial Values):</strong>
          <div class="mt-2 space-y-2 font-mono text-xs bg-white p-4 rounded border">
            <div class="flex justify-between">
              <span class="text-gray-600">VITE_ENV_apiBaseUrl:</span>
              <span class="text-gray-900">{import.meta.env.VITE_ENV_apiBaseUrl ? `${String(import.meta.env.VITE_ENV_apiBaseUrl).substring(0, 30)}...` : '❌ Not set'}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">VITE_STRIPE_PUBLISHABLE_KEY:</span>
              <span class="text-gray-900">{import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? `${String(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY).substring(0, 20)}...` : '❌ Not set'}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">VITE_ENV_supabaseUrl:</span>
              <span class="text-gray-900">{import.meta.env.VITE_ENV_supabaseUrl ? `${String(import.meta.env.VITE_ENV_supabaseUrl).substring(0, 30)}...` : '❌ Not set'}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">VITE_ENV_supabasekey:</span>
              <span class="text-gray-900">{import.meta.env.VITE_ENV_supabasekey ? `${String(import.meta.env.VITE_ENV_supabasekey).substring(0, 20)}...` : '❌ Not set'}</span>
            </div>
          </div>
        </div>
        
        <div>
          <strong class="text-gray-800">Runtime Status:</strong>
          <div class="mt-2 space-y-2 bg-white p-4 rounded border">
            <div class="flex justify-between">
              <span class="text-gray-600">Stripe Instance Loaded:</span>
              <span class="text-gray-900">{stripeInstance ? '✅ Yes' : '❌ No'}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Stripe Version:</span>
              <span class="text-gray-900">{stripeInstance ? (stripeInstance._version || 'Unknown') : 'N/A'}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Browser:</span>
              <span class="text-gray-900">{navigator.userAgent.includes('Chrome') ? 'Chrome' : navigator.userAgent.includes('Firefox') ? 'Firefox' : navigator.userAgent.includes('Safari') ? 'Safari' : 'Other'}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Test Environment:</span>
              <span class="text-gray-900">{import.meta.env.DEV ? 'Development' : 'Production'}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Current Time:</span>
              <span class="text-gray-900">{new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div>
          <strong class="text-gray-800">Available Environment Variables:</strong>
          <div class="mt-2 bg-white p-4 rounded border max-h-40 overflow-y-auto">
            <pre class="text-xs text-gray-600">{JSON.stringify(
              Object.keys(import.meta.env)
                .filter(key => key.startsWith('VITE_'))
                .reduce((obj, key) => {
                  obj[key] = import.meta.env[key] ? `${String(import.meta.env[key]).substring(0, 20)}...` : 'Not set';
                  return obj;
                }, {}), 
              null, 
              2
            )}</pre>
          </div>
        </div>

        <div>
          <strong class="text-gray-800">Test Results Summary:</strong>
          <div class="mt-2 bg-white p-4 rounded border">
            <div class="flex justify-between">
              <span class="text-gray-600">Total Tests:</span>
              <span class="text-gray-900">{testResults.length}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Successful:</span>
              <span class="text-green-600">{testResults.filter(r => r.status === 'success').length}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Failed:</span>
              <span class="text-red-600">{testResults.filter(r => r.status === 'error').length}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Info:</span>
              <span class="text-blue-600">{testResults.filter(r => r.status === 'info').length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
