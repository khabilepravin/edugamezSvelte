<script>
    import Icon from '@iconify/svelte';
    import { onMount } from 'svelte';
    import { userSession } from '$lib/store/userSession.js';
    import { getAllUserListsByUserId } from '$lib/supabasedb/userLists.ts';
    import Loading from '$lib/components/loading.svelte';
    
    let wordLists = [];
    let isLoading = true;
    let error = null;
    
    // Reactive user session
    $: session = $userSession;
    
    onMount(async () => {
        console.log('🔍 My Lists page mounted, session state:', session);
        
        // Wait a bit for session to be fully loaded if needed
        if (session.isLoading) {
            console.log('⏳ Session is loading, waiting...');
            // Wait for session to load
            const unsubscribe = userSession.subscribe(currentSession => {
                if (!currentSession.isLoading) {
                    unsubscribe();
                    loadUserLists(currentSession);
                }
            });
        } else {
            loadUserLists(session);
        }
    });
    
    async function loadUserLists(currentSession) {
        try {
            if (currentSession.user?.id) {
                console.log('📚 Loading user lists for user:', currentSession.user.id);
                const lists = await getAllUserListsByUserId(currentSession.user.id);
                
                if (lists && lists.length > 0) {
                    wordLists = lists.map(list => ({
                        id: list.list_id,
                        name: list.list_name || 'Unnamed List',
                        totalWords: list.total_words || 0,
                        lastModified: list.last_updated || list.created_at,
                        class: list.class || 'Not specified',
                        description: list.description || ''
                    }));
                    console.log('✅ User lists loaded:', wordLists);
                } else {
                    console.log('📝 No lists found for user');
                    wordLists = [];
                }
            } else {
                console.log('⚠️ No user session found, current session:', currentSession);
                error = 'User not authenticated';
            }
        } catch (err) {
            console.error('❌ Error loading user lists:', err);
            error = 'Failed to load your lists';
        } finally {
            isLoading = false;
        }
    }
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

    <!-- Loading State -->
    {#if isLoading}
        <div class="flex justify-center items-center py-12">
            <Loading />
        </div>
    {:else if error}
        <!-- Error State -->
        <div class="card p-8 text-center variant-soft-error">
            <Icon 
                icon="mdi:alert-circle" 
                class="text-4xl mb-2 text-error-500 mx-auto" 
            />
            <p class="text-error-700 mb-4">{error}</p>
            <button 
                class="btn variant-filled-primary"
                onclick={() => window.location.reload()}
            >
                Try Again
            </button>
        </div>
    {:else if wordLists.length > 0}
        <!-- Lists Grid -->
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
                    
                    {#if list.description}
                        <p class="text-sm text-surface-600 mb-2">{list.description}</p>
                    {/if}
                    
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
                    
                    <div class="mt-4 pt-4 border-surface-300 border-t">
                        <a 
                            href="/spelling/{list.id}" 
                            class="btn variant-filled-primary w-full"
                            onclick={() => console.log('🎯 Starting practice for list:', list.id, list.name)}
                        >
                            <Icon icon="mdi:play" class="inline mr-2" />
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