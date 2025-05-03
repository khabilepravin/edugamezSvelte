<script>
    import Icon from '@iconify/svelte';
    
    // Example data - replace with actual data fetching logic
    let wordLists = [
        {
            id: 1,
            name: 'Common Words',
            totalWords: 20,
            lastModified: '2024-03-23',
            class: 'Grade 1'
        },
        {
            id: 2,
            name: 'Advanced Vocabulary',
            totalWords: 30,
            lastModified: '2024-03-22',
            class: 'Grade 3'
        }
    ];
</script>

<div class="container mx-auto p-4">
    <!-- Header with Create Button -->
    <div class="flex justify-between items-center mb-8">
        <h2 class="h2">My Word Lists</h2>
        <a 
            href="/spelling/mylists/create" 
            class="btn variant-filled-primary"
        >
            <Icon icon="mdi:plus" class="text-xl mr-2" />
            Create New List
        </a>
    </div>

    <!-- Lists Grid -->
    {#if wordLists.length > 0}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each wordLists as list (list.id)}
                <div class="card p-4">
                    <header class="flex justify-between items-start mb-4">
                        <div>
                            <h3 class="h3">{list.name}</h3>
                            <p class="text-sm text-surface-600">Class: {list.class}</p>
                        </div>
                        <div class="flex gap-2">
                            <button class="btn btn-sm variant-soft-primary">
                                <Icon icon="mdi:pencil" />
                            </button>
                            <button class="btn btn-sm variant-soft-error">
                                <Icon icon="mdi:delete" />
                            </button>
                        </div>
                    </header>
                    
                    <div class="flex justify-between items-center text-sm text-surface-600">
                        <span>
                            <Icon icon="mdi:book" class="inline mr-1" />
                            {list.totalWords} words
                        </span>
                        <span>
                            <Icon icon="mdi:calendar" class="inline mr-1" />
                            {new Date(list.lastModified).toLocaleDateString()}
                        </span>
                    </div>
                    
                    <div class="mt-4 pt-4 border-t border-surface-300">
                        <a 
                            href="/spelling/practice/{list.id}" 
                            class="btn variant-filled-primary w-full"
                        >
                            Start Practice
                        </a>
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <!-- Empty State -->
        <div class="card p-8 text-center">
            <Icon 
                icon="mdi:book-open-page-variant" 
                class="text-4xl mb-2 text-surface-500 mx-auto" 
            />
            <p class="text-surface-600 mb-4">
                You haven't created any word lists yet.
            </p>
            <a 
                href="/spelling/mylists/create" 
                class="btn variant-filled-primary"
            >
                Create Your First List
            </a>
        </div>
    {/if}
</div>