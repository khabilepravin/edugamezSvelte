<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { getTestById } from '$lib/api/tests';
  import Loading from '$lib/components/loading.svelte';

  let testData = null;
  let isLoading = true;
  let error = null;
  let testId = null;

  onMount(async () => {
    testId = $page.url.searchParams.get('testId');
    
    if (!testId) {
      error = 'No test ID provided';
      isLoading = false;
      return;
    }

    try {
      const rawTestData = await getTestById(testId);
      // Parse the test data if it's JSON, otherwise use as is
      try {
        testData = JSON.parse(rawTestData);
      } catch {
        testData = { content: rawTestData };
      }
    } catch (err) {
      error = err.message;
    } finally {
      isLoading = false;
    }
  });

  function startPractice() {
    // Navigate to the actual practice/test taking interface
    goto(`/mytests/practice/start?testId=${testId}`);
  }

  function goBack() {
    goto('/mytests');
  }
</script>

<svelte:head>
  <title>Practice Test - EduGamez</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="max-w-4xl mx-auto">
    <!-- Back button -->
    <div class="mb-6">
      <button
        class="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        on:click={goBack}
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to My Tests
      </button>
    </div>

    {#if isLoading}
      <div class="flex justify-center items-center py-12">
        <Loading />
      </div>
    {:else if error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <h3 class="font-bold">Error loading test</h3>
        <p>{error}</p>
        <button 
          class="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          on:click={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    {:else if testData}
      <div class="bg-white rounded-lg shadow-lg p-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-800 mb-4">
            {testData.title || `Test ${testId}`}
          </h1>
          
          {#if testData.description}
            <p class="text-gray-600 text-lg mb-6">{testData.description}</p>
          {/if}

          <div class="flex flex-wrap gap-4 text-sm">
            {#if testData.questionCount}
              <div class="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {testData.questionCount} Questions
              </div>
            {/if}
            
            {#if testData.duration}
              <div class="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {testData.duration} minutes
              </div>
            {/if}
            
            {#if testData.difficulty}
              <div class="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {testData.difficulty}
              </div>
            {/if}
          </div>
        </div>

        <!-- Test Instructions -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Instructions</h2>
          <div class="bg-gray-50 p-4 rounded-lg">
            {#if testData.instructions}
              <p class="text-gray-700">{testData.instructions}</p>
            {:else}
              <ul class="text-gray-700 space-y-2">
                <li>• Read each question carefully before answering</li>
                <li>• You can navigate between questions using the navigation buttons</li>
                <li>• Make sure to submit your answers before the time runs out</li>
                <li>• Review your answers before final submission</li>
              </ul>
            {/if}
          </div>
        </div>

        <!-- Test Content Preview -->
        {#if testData.content && testData.content !== testData.title}
          <div class="mb-8">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Test Content</h2>
            <div class="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
              <pre class="text-sm text-gray-700 whitespace-pre-wrap">{testData.content}</pre>
            </div>
          </div>
        {/if}

        <!-- Action Buttons -->
        <div class="flex gap-4 justify-center">
          <button
            class="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            on:click={startPractice}
          >
            Start Practice Test
          </button>
          <button
            class="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            on:click={goBack}
          >
            Back to Tests
          </button>
        </div>
      </div>
    {:else}
      <div class="text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 class="text-xl font-medium text-gray-700 mb-2">Test not found</h3>
        <p class="text-gray-500 mb-4">The requested test could not be found.</p>
        <button 
          class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
          on:click={goBack}
        >
          Back to My Tests
        </button>
      </div>
    {/if}
  </div>
</div>
