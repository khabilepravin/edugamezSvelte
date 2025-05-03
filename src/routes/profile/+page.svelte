<script>
    import Icon from '@iconify/svelte';
    import { page } from '$app/stores';
    
    let userProfile = {
        fullName: $page.data.user_metadata?.full_name || 'User Name',
        email: $page.data.user?.email || 'email@example.com',
        joinDate: new Date($page.data.user?.created_at).toLocaleDateString() || 'N/A'
    };
</script>
<div class="max-w-3xl mx-auto px-4 py-8">
    <!-- Header Section -->
    <div class="flex items-center gap-6 mb-12 border-b pb-8">
        <div class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
            <Icon icon="mdi:account" class="text-3xl text-gray-600" />
        </div>
        <div>
            <h1 class="text-2xl font-bold">{userProfile.fullName}</h1>
            <p class="text-gray-600">Member since {userProfile.joinDate}</p>
        </div>
    </div>

    <div class="space-y-12">
        <!-- Profile Information -->
        <section class="border-b pb-12">
            <h2 class="text-xl font-semibold mb-6">Profile Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-medium text-gray-600">Full Name</label>
                    <p class="mt-1 p-2 bg-gray-50 rounded-md w-full">{userProfile.fullName}</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-600">Email</label>
                    <p class="mt-1 p-2 bg-gray-50 rounded-md w-full">{userProfile.email}</p>
                </div>
            </div>
        </section>

        <!-- Statistics -->
        <section class="border-b pb-12">
            <h2 class="text-xl font-semibold mb-6">Statistics</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="text-center p-6 bg-gray-50 rounded-lg shadow-sm">
                    <p class="text-2xl font-bold">0</p>
                    <p class="text-gray-600">Total Tests</p>
                </div>
                <div class="text-center p-6 bg-gray-50 rounded-lg shadow-sm">
                    <p class="text-2xl font-bold">0</p>
                    <p class="text-gray-600">Words Learned</p>
                </div>
                <div class="text-center p-6 bg-gray-50 rounded-lg shadow-sm">
                    <p class="text-2xl font-bold">0%</p>
                    <p class="text-gray-600">Accuracy</p>
                </div>
            </div>
        </section>

        <!-- Actions -->
        <div class="flex justify-end gap-4 pt-4">
            <button class="inline-flex items-center justify-center px-6 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Edit Profile
            </button>
            <button class="inline-flex items-center justify-center px-6 py-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Change Password
            </button>
        </div>
    </div>
</div>