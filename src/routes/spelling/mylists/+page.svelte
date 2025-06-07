<script lang="ts">
    import { getListsCreatedByUser } from '$lib/supabasedb/userLists';
    import { user } from '$lib/store/userStore';
    import { onMount } from 'svelte';
    
    let currentUser = $user;
    let lists = [];
    let loading = true;
    let error = null;

    async function loadLists() {
        try {
            debugger;
            if (currentUser?.details?.id) {
                lists = await getListsCreatedByUser(currentUser.details.id);
            }
        } catch (e) {
            error = e.message;
            console.error('Error loading lists:', e);
        } finally {
            loading = false;
        }
    }

    // Subscribe to user store changes
    user.subscribe(value => {
        currentUser = value;
        if (currentUser?.details?.id) {
            loadLists();
        }
    });

    onMount(async () => {        
        console.log('Current User:', currentUser);
        if (currentUser?.details?.id) {
            await loadLists();
        }
    });
</script>

<svelte:head>
    <title>My Lists | MaxSpelling</title>
</svelte:head>

<div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-8">
        <h2 class="h2">My Lists</h2>
        <a href="/spelling/mylists/create" class="btn variant-filled-primary">
            Create New List
        </a>
    </div>

    {#if loading}
        <div class="flex justify-center p-8">
            <span class="loading loading-spinner loading-lg"></span>
        </div>
    {:else if error}
        <div class="alert variant-filled-error">
            <span>Error loading lists: {error}</span>
        </div>
    {:else if lists.length === 0}
        <div class="card p-8 text-center variant-ghost">
            <h3 class="h3 mb-4">No Lists Found</h3>
            <p class="mb-4">You haven't created any spelling lists yet.</p>
            <a href="/spelling/mylists/create" class="btn variant-filled-primary">
                Create Your First List
            </a>
        </div>
    {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each lists as list}
                <div class="card p-4 variant-filled-surface">
                    <header class="card-header">
                        <h3 class="h3">{list.list_name}</h3>
                        <p class="opacity-75 text-sm">
                            Created: {new Date(list.created_at).toLocaleDateString()}
                        </p>
                    </header>
                    <div class="p-4">
                        <p class="mb-4">{list.description || 'No description provided'}</p>
                        <div class="flex items-center gap-2 mb-4">
                            <span class="badge variant-filled">Grade {list.difficulty_level}</span>
                            <span class="badge variant-ghost">
                                {list.is_public ? 'Public' : 'Private'}
                            </span>
                        </div>
                    </div>
                    <footer class="card-footer flex justify-end gap-2">
                        <a href="/spelling/mylists/{list.id}/edit" class="btn variant-soft">
                            Edit
                        </a>
                        <a href="/spelling/mylists/{list.id}" class="btn variant-filled">
                            View
                        </a>
                    </footer>
                </div>
            {/each}
        </div>
    {/if}
</div>