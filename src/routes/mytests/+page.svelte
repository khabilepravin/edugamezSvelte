<script>
  import { onMount } from 'svelte';
  import { getTests } from '$lib/api/tests';
  import Loading from '$lib/components/loading.svelte';
  import { goto } from '$app/navigation';

  let tests = [];
  let isLoading = true;
  let error = null;

  onMount(async () => {
    try {
      tests = await getTests();
    } catch (err) {
      error = err.message;
    } finally {
      isLoading = false;
    }
  });

  function navigateToTest(testId) {
    goto(`/mytests/practice?testId=${testId}`);
  }
</script>

<svelte:head>
  <title>My Tests - EduGamez</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="max-w-4xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">My Tests</h1>
      <p class="text-gray-600">View and practice your created tests</p>
    </div>

    {#if isLoading}
      <div class="flex justify-center items-center py-12">
        <Loading />
      </div>
    {:else if error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <h3 class="font-bold">Error loading tests</h3>
        <p>{error}</p>
        <button 
          class="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          on:click={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    {:else if tests.length === 0}
      <div class="text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 class="text-xl font-medium text-gray-700 mb-2">No tests found</h3>
        <p class="text-gray-500 mb-4">You haven't created any tests yet.</p>
        <button 
          class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
          on:click={() => goto('/create-test')}
        >
          Create Your First Test
        </button>
      </div>
    {:else}
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {#each tests as test}
          <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col">
            <div class="flex-1 mb-4">
              <h3 class="text-lg font-semibold text-gray-800 mb-2">
                {test.title || `Test ${test.id}`}
              </h3>
              {#if test.description}
                <p class="text-gray-600 text-sm mb-3">{test.description}</p>
              {/if}
              <div class="flex items-center text-sm text-gray-500 space-x-4">
                {#if test.questionCount}
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {test.questionCount} questions
                  </span>
                {/if}
              </div>
            </div>
            
            <div class="mt-auto">
              {#if test.createdAt}
                <div class="flex items-center text-sm text-gray-500 mb-3">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Created: {new Date(test.createdAt).toLocaleDateString()}
                </div>
              {/if}
              <div class="flex gap-2">
                <button
                  class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
                  on:click={() => navigateToTest(test.id)}
                >
                  Practice
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
