<script lang="ts">
    import { ProgressBar, TabGroup, Tab } from '@skeletonlabs/skeleton';

    // Mock data for students
    const students = [
        {
            id: 1,
            name: 'John Smith',
            grade: '5th',
            progress: 75,
            wordsLearned: 120,
            accuracy: 85
        },
        // Add more student data as needed
    ];

    // Mock data for word lists
    const wordLists = [
        {
            id: 1,
            name: 'Common Misspellings',
            wordCount: 20,
            assignedTo: 15
        },
        // Add more list data as needed
    ];

    // Mock class statistics
    const classStats = {
        totalStudents: 25,
        averageAccuracy: 82,
        totalWords: 1500,
        activeStudents: 22
    };
</script>

<div class="container mx-auto p-4 space-y-6">
    <h1 class="h1 mb-4">Teacher Dashboard</h1>

    <!-- Class Overview Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="card p-4 variant-filled-surface">
            <h3 class="h3">Total Students</h3>
            <p class="text-4xl font-bold">{classStats.totalStudents}</p>
        </div>
        <div class="card p-4 variant-filled-surface">
            <h3 class="h3">Class Accuracy</h3>
            <p class="text-4xl font-bold">{classStats.averageAccuracy}%</p>
        </div>
        <div class="card p-4 variant-filled-surface">
            <h3 class="h3">Total Words</h3>
            <p class="text-4xl font-bold">{classStats.totalWords}</p>
        </div>
        <div class="card p-4 variant-filled-surface">
            <h3 class="h3">Active Students</h3>
            <p class="text-4xl font-bold">{classStats.activeStudents}</p>
        </div>
    </div>

    <!-- Word Lists Management -->
    <div class="card p-6 variant-filled-surface">
        <div class="flex justify-between items-center mb-4">
            <h2 class="h2">Word Lists</h2>
            <button class="btn variant-filled-primary">Create New List</button>
        </div>
        <div class="space-y-2">
            {#each wordLists as list}
                <div class="flex justify-between items-center p-4 bg-surface-200-700-token rounded">
                    <div>
                        <h3 class="font-bold">{list.name}</h3>
                        <p class="text-sm">{list.wordCount} words • {list.assignedTo} students assigned</p>
                    </div>
                    <div class="space-x-2">
                        <button class="btn variant-soft">Edit</button>
                        <button class="btn variant-soft">Assign</button>
                    </div>
                </div>
            {/each}
        </div>
    </div>

    <!-- Student Progress -->
    <div class="card p-6 variant-filled-surface">
        <h2 class="h2 mb-4">Student Progress</h2>
        <div class="space-y-4">
            {#each students as student}
                <div class="flex flex-col gap-2 p-4 bg-surface-200-700-token rounded">
                    <div class="flex justify-between items-center">
                        <div>
                            <h3 class="font-bold">{student.name}</h3>
                            <p class="text-sm">{student.grade} • {student.wordsLearned} words learned</p>
                        </div>
                        <button class="btn variant-soft">View Details</button>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="flex-1">
                            <ProgressBar 
                                value={student.progress} 
                                max={100} 
                                height="h-2" 
                                meter="bg-primary-500" 
                                track="bg-primary-100"
                            />
                        </div>
                        <span class="text-sm font-bold">{student.accuracy}%</span>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>
