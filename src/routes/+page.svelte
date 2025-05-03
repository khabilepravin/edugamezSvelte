<script>
    import Icon from '@iconify/svelte';
</script>
<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->
<svelte:head>
    <title>MaxSpelling-Up Your Spelling Game</title>
</svelte:head>

<div class="container h-full mx-auto flex justify-center items-center">
    <div class="space-y-5 text-center flex flex-col items-center">
        <h2 class="h2 my-2">Welcome to MaxSpelling</h2>
        <h4 class="h4">Select your level to practice</h4>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-3xl">
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
</div>
