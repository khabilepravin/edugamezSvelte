<script>
    import Icon from '@iconify/svelte';
    import { userSession } from '$lib/store/userSession.js';
    import { onMount } from 'svelte';
    
    // Reactive subscription data
    $: session = $userSession;
    $: subscriptionLevel = session.userSubscriptionLevel || 'free';
    $: isLoading = session.isLoading;
    
    // Preload icons on component mount
    onMount(async () => {
        // Preload all icons used on this page
        const iconsToPreload = [
            'mdi:book-education-outline',
            'mdi:chart-line-variant', 
            'mdi:star-circle',
            'mdi:account-outline',
            'mdi:credit-card-outline'
        ];
        
        // Import the loadIcons function to preload icons
        try {
            const { loadIcons } = await import('@iconify/svelte');
            await loadIcons(iconsToPreload);
            console.log('✅ Icons preloaded successfully');
        } catch (error) {
            console.log('⚠️ Icon preloading failed, icons will load on demand:', error);
        }
    });
    
    // Debug logging
    $: {
        console.log('🔍 Home page debug:');
        console.log('  - session:', session);
        console.log('  - subscriptionLevel:', subscriptionLevel);
        console.log('  - isLoading:', isLoading);
        console.log('  - Should show premium section:', !isLoading && subscriptionLevel === 'free');
    }
</script>
<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->
<svelte:head>
    <title>MaxSpelling-Up Your Spelling Game</title>
</svelte:head>

<div class="container h-full mx-auto flex justify-center items-center">
    <div class="space-y-8 text-center flex flex-col items-center">
        <h2 class="h2 my-2">Welcome to MaxSpelling</h2>
        
        <!-- Spelling Section -->
        <div class="space-y-4">
            <!-- <h3 class="h3 text-primary-500">Spelling</h3> -->
            <!-- <p class="text-surface-600-300-token">Select your level to practice spelling</p> -->
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
                <a class="card p-4 flex flex-col items-center justify-center h-32 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 bg-surface-100-800-token" href="/spelling/low">
                    <div class="icon-container mb-3">
                        <Icon icon="mdi:book-education-outline" class="text-4xl text-primary-500" />
                    </div>
                    <span class="font-bold">Beginner</span>
                </a>
                
                <a class="card p-4 flex flex-col items-center justify-center h-32 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 bg-surface-100-800-token" href="/spelling/medium">
                    <div class="icon-container mb-3">
                        <Icon icon="mdi:chart-line-variant" class="text-4xl text-secondary-500" />
                    </div>
                    <span class="font-bold">Intermediate</span>
                </a>
                
                <a class="card p-4 flex flex-col items-center justify-center h-32 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 bg-surface-100-800-token" href="/spelling/high">
                    <div class="icon-container mb-3">
                        <Icon icon="mdi:star-circle" class="text-4xl text-tertiary-500" />
                    </div>
                    <span class="font-bold">Advanced</span>
                </a>
                
                <a class="card p-4 flex flex-col items-center justify-center h-32 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 bg-surface-100-800-token" href="/spelling/mylists">
                    <div class="icon-container mb-3">
                        <Icon icon="mdi:account-outline" class="text-4xl text-warning-500" />
                    </div>
                    <span class="font-bold">My Lists</span>
                </a>
            </div>
        </div>
        
        <!-- Payment Section - Only show for free users -->
        <!-- {#if !isLoading && subscriptionLevel === 'free'}
            <div class="space-y-4">
                <h3 class="h3 text-warning-500">Premium Plans</h3>
                <p class="text-surface-600-300-token">Unlock advanced features with our premium plans</p>
                
                <div class="flex justify-center w-full max-w-4xl">
                    <a class="card p-4 flex flex-col items-center justify-center h-32 w-64 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 bg-surface-100-800-token" href="/payment">
                        <Icon icon="mdi:credit-card-outline" class="text-4xl mb-3 text-warning-500" />
                        <span class="font-bold">Upgrade Now</span>
                    </a>
                </div>
            </div>
        {/if} -->
    </div>
</div>

<style>
    .icon-container {
        min-height: 2.5rem; /* 4xl text size equivalent */
        min-width: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }
    
    /* Placeholder for loading icons */
    .icon-container:empty::before {
        content: '';
        width: 2.5rem;
        height: 2.5rem;
        background: rgba(var(--color-surface-400) / 0.3);
        border-radius: 0.375rem;
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
</style>
