<script>
    import Icon from '@iconify/svelte';
    import { page } from '$app/stores';
    import UserSubscriptionStatus from '$lib/components/UserSubscriptionStatus.svelte';
    import { userSession } from '$lib/store/userSession.js';
    import { getSubscriptionDisplayInfo } from '$lib/store/subscriptionUtils.js';
    
    let userProfile = {
        fullName: $page.data.user_metadata?.full_name || 'User Name',
        email: $page.data.user?.email || 'email@example.com',
        joinDate: new Date($page.data.user?.created_at).toLocaleDateString() || 'N/A'
    };

    // Reactive subscription data
    $: session = $userSession;
    $: subscriptionLevel = session.userSubscriptionLevel || 'free';
    $: subscriptionInfo = getSubscriptionDisplayInfo(subscriptionLevel);
</script>
<div class="max-w-3xl mx-auto px-4 py-8">
    <!-- Header Section -->
    <div class="flex items-center gap-6 mb-12 border-b pb-8">
        <div class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
            <Icon icon="mdi:account" class="text-3xl text-gray-600" />
        </div>
        <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
                <h1 class="text-2xl font-bold">{userProfile.fullName}</h1>
                <!-- Subscription Level Tag -->
                <span class="subscription-tag subscription-{subscriptionInfo.color}">
                    {subscriptionInfo.badge}
                </span>
            </div>
            <p class="text-gray-600">Member since {userProfile.joinDate}</p>
            {#if session.userRole}
                <p class="text-sm text-gray-500 capitalize">Role: {session.userRole}</p>
            {/if}
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
                <div>
                    <label class="block text-sm font-medium text-gray-600">User Role</label>
                    <p class="mt-1 p-2 bg-gray-50 rounded-md w-full capitalize">{session.userRole || 'Not specified'}</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-600">Subscription Level</label>
                    <div class="mt-1 p-2 bg-gray-50 rounded-md w-full flex items-center justify-between">
                        <span class="capitalize">{subscriptionInfo.name}</span>
                        <span class="subscription-tag subscription-{subscriptionInfo.color}">
                            {subscriptionInfo.badge}
                        </span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Subscription Status -->
        <section class="border-b pb-12">
            <h2 class="text-xl font-semibold mb-6">Subscription Details</h2>
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900">Current Plan: {subscriptionInfo.name}</h3>
                        <p class="text-sm text-gray-600">{subscriptionInfo.description}</p>
                    </div>
                    <span class="subscription-tag subscription-{subscriptionInfo.color}">
                        {subscriptionInfo.badge}
                    </span>
                </div>
                
                <!-- Features based on subscription level -->
                <div class="mt-4">
                    <h4 class="font-medium text-gray-900 mb-2">Available Features:</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {#if subscriptionLevel === 'free'}
                            <div class="flex items-center text-sm text-gray-600">
                                <Icon icon="mdi:check-circle" class="text-green-500 mr-2" />
                                Basic spelling tests
                            </div>
                            <div class="flex items-center text-sm text-gray-600">
                                <Icon icon="mdi:check-circle" class="text-green-500 mr-2" />
                                Limited word lists
                            </div>
                        {:else if subscriptionLevel === 'basic'}
                            <div class="flex items-center text-sm text-gray-600">
                                <Icon icon="mdi:check-circle" class="text-green-500 mr-2" />
                                All free features
                            </div>
                            <div class="flex items-center text-sm text-gray-600">
                                <Icon icon="mdi:check-circle" class="text-green-500 mr-2" />
                                Advanced spelling tests
                            </div>
                        {:else if subscriptionLevel === 'pro'}
                            <div class="flex items-center text-sm text-gray-600">
                                <Icon icon="mdi:check-circle" class="text-green-500 mr-2" />
                                All features included
                            </div>
                            <div class="flex items-center text-sm text-gray-600">
                                <Icon icon="mdi:check-circle" class="text-green-500 mr-2" />
                                Custom word lists
                            </div>
                            <div class="flex items-center text-sm text-gray-600">
                                <Icon icon="mdi:check-circle" class="text-green-500 mr-2" />
                                Detailed analytics
                            </div>
                            <div class="flex items-center text-sm text-gray-600">
                                <Icon icon="mdi:check-circle" class="text-green-500 mr-2" />
                                Unlimited tests
                            </div>
                        {:else}
                            <div class="flex items-center text-sm text-gray-600">
                                <Icon icon="mdi:check-circle" class="text-green-500 mr-2" />
                                Premium features
                            </div>
                        {/if}
                    </div>
                </div>
                
                {#if subscriptionLevel === 'free'}
                    <div class="mt-4 pt-4 border-t border-gray-200">
                        <a href="/payment" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                            Upgrade to Pro
                            <Icon icon="mdi:arrow-right" class="ml-2" />
                        </a>
                    </div>
                {/if}
            </div>
            
            <!-- Keep the existing UserSubscriptionStatus component -->
            <UserSubscriptionStatus />
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

<style>
    .subscription-tag {
        display: inline-flex;
        align-items: center;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .subscription-gray {
        background-color: #f3f4f6;
        color: #374151;
    }

    .subscription-blue {
        background-color: #dbeafe;
        color: #1d4ed8;
    }

    .subscription-green {
        background-color: #d1fae5;
        color: #065f46;
    }

    .subscription-purple {
        background-color: #e9d5ff;
        color: #7c2d12;
    }
</style>