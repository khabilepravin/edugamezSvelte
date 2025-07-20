<script>
    import Icon from '@iconify/svelte';
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
            <h3 class="h3 text-primary-500">Spelling</h3>
            <p class="text-surface-600-300-token">Select your level to practice spelling</p>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
                <a class="card p-4 flex flex-col items-center justify-center h-32 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 bg-surface-100-800-token" href="/spelling/low">
                    <Icon icon="mdi:book-education-outline" class="text-4xl mb-3 text-primary-500" />
                    <span class="font-bold">Beginner</span>
                </a>
                
                <a class="card p-4 flex flex-col items-center justify-center h-32 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 bg-surface-100-800-token" href="/spelling/medium">
                    <Icon icon="mdi:chart-line-variant" class="text-4xl mb-3 text-secondary-500" />
                    <span class="font-bold">Intermediate</span>
                </a>
                
                <a class="card p-4 flex flex-col items-center justify-center h-32 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 bg-surface-100-800-token" href="/spelling/high">
                    <Icon icon="mdi:star-circle" class="text-4xl mb-3 text-tertiary-500" />
                    <span class="font-bold">Advanced</span>
                </a>
                
                <a class="card p-4 flex flex-col items-center justify-center h-32 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 bg-surface-100-800-token" href="/spelling/mylists">
                    <Icon icon="mdi:account-outline" class="text-4xl mb-3 text-warning-500" />
                    <span class="font-bold">My Lists</span>
                </a>
            </div>
        </div>
        
        <!-- Practice Tests Section -->
        <div class="space-y-4">
            <h3 class="h3 text-success-500">Practice Tests</h3>
            <p class="text-surface-600-300-token">Take custom tests</p>
            
            <div class="flex justify-center w-full max-w-4xl">
                <a class="card p-4 flex flex-col items-center justify-center h-32 w-64 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 bg-surface-100-800-token" href="/mytests">
                    <Icon icon="mdi:clipboard-check-outline" class="text-4xl mb-3 text-success-500" />
                    <span class="font-bold">My Tests</span>
                </a>
            </div>
        </div>

        <!-- Payment Section -->
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
    </div>
</div>
