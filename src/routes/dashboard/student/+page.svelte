<script lang="ts">
    import { ProgressBar, TabGroup, Tab } from '@skeletonlabs/skeleton';

    // Mock data (replace with actual data from your backend)
    const stats = {
        totalWords: 250,
        accuracy: 85,
        streak: 7,
        lastPractice: '2 hours ago'
    };

    const recentWords = [
        { word: 'accommodate', correct: true },
        { word: 'necessary', correct: true },
        { word: 'hierarchy', correct: false },
        { word: 'separate', correct: true }
    ];
</script>

<div class="container mx-auto p-4 space-y-6">
    <h1 class="h1 mb-4">Student Dashboard</h1>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="card p-4 variant-filled-surface">
            <h3 class="h3">Words Practiced</h3>
            <p class="text-4xl font-bold">{stats.totalWords}</p>
        </div>
        <div class="card p-4 variant-filled-surface">
            <h3 class="h3">Accuracy</h3>
            <p class="text-4xl font-bold">{stats.accuracy}%</p>
        </div>
        <div class="card p-4 variant-filled-surface">
            <h3 class="h3">Daily Streak</h3>
            <p class="text-4xl font-bold">{stats.streak} days</p>
        </div>
        <div class="card p-4 variant-filled-surface">
            <h3 class="h3">Last Practice</h3>
            <p class="text-4xl font-bold">{stats.lastPractice}</p>
        </div>
    </div>

    <!-- Progress Section -->
    <div class="card p-6 variant-filled-surface">
        <h2 class="h2 mb-4">Weekly Progress</h2>
        <ProgressBar value={75} max={100} height="h-4" meter="bg-primary-500" track="bg-primary-100" />
    </div>

    <!-- Recent Activity -->
    <div class="card p-6 variant-filled-surface">
        <h2 class="h2 mb-4">Recent Words</h2>
        <div class="space-y-2">
            {#each recentWords as {word, correct}}
                <div class="flex justify-between items-center p-2 bg-surface-200-700-token rounded">
                    <span class="font-semibold">{word}</span>
                    <span class={correct ? "text-success-500" : "text-error-500"}>
                        {correct ? '✓' : '✗'}
                    </span>
                </div>
            {/each}
        </div>
    </div>

    <!-- Practice Button -->
    <div class="flex justify-center">
        <a href="/practice" class="btn variant-filled-primary">Start New Practice</a>
    </div>
</div>
