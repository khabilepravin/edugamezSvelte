<!--
  User Subscription Status Component
  Displays the current user's subscription level
-->
<script>
  import { userSession, hasProSubscription } from '$lib/store/userSession.js';
  
  // Reactive subscriptions to the store
  $: session = $userSession;
  $: isPro = $hasProSubscription;
</script>

{#if session.isLoading}
  <div class="subscription-status loading">
    <span class="loading-text">Loading subscription...</span>
  </div>
{:else if session.isAuthenticated}
  <div class="subscription-status authenticated">
    <div class="user-info">
      <span class="display-name">{session.displayName || 'User'}</span>
      <span class="role">({session.userRole || 'student'})</span>
    </div>
    
    <div class="subscription-info">
      <span class="subscription-label">Subscription:</span>
      <span class="subscription-level {session.userSubscriptionLevel}">
        {session.userSubscriptionLevel || 'free'}
      </span>
      
      {#if isPro}
        <span class="pro-badge">PRO</span>
      {/if}
    </div>
  </div>
{:else}
  <div class="subscription-status unauthenticated">
    <span>Not logged in</span>
  </div>
{/if}

<style>
  .subscription-status {
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid #e2e8f0;
    font-size: 0.875rem;
  }
  
  .subscription-status.loading {
    background-color: #f8fafc;
    color: #64748b;
  }
  
  .subscription-status.authenticated {
    background-color: #f0fdf4;
    border-color: #bbf7d0;
  }
  
  .subscription-status.unauthenticated {
    background-color: #fef2f2;
    border-color: #fecaca;
    color: #dc2626;
  }
  
  .user-info {
    margin-bottom: 0.5rem;
  }
  
  .display-name {
    font-weight: 600;
    color: #1f2937;
  }
  
  .role {
    color: #6b7280;
    font-size: 0.75rem;
    margin-left: 0.25rem;
  }
  
  .subscription-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .subscription-label {
    color: #6b7280;
  }
  
  .subscription-level {
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.75rem;
    padding: 0.125rem 0.5rem;
    border-radius: 9999px;
  }
  
  .subscription-level.free {
    background-color: #f3f4f6;
    color: #374151;
  }
  
  .subscription-level.pro {
    background-color: #dbeafe;
    color: #1d4ed8;
  }
  
  .pro-badge {
    background-color: #10b981;
    color: white;
    font-size: 0.625rem;
    font-weight: 700;
    padding: 0.125rem 0.375rem;
    border-radius: 9999px;
  }
  
  .loading-text {
    color: #6b7280;
  }
</style>
