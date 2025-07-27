<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { createClient } from '@supabase/supabase-js';
	import { onMount } from 'svelte';
	import { sessionActions } from '$lib/store/userSession.js';
	import { getUserProfileByUserId, createUserProfileByUserId, createUserProfileData } from '$lib/api/userProfiles';

	let data = $props();
	const supabase = createClient(
		import.meta.env.VITE_ENV_supabaseUrl,
		import.meta.env.VITE_ENV_supabasekey
	);

	//TODO: This is super stupid hack, do the whole auth on the server instead.
	let showLogin = $state(false);

	const redirectTo = $page.url.searchParams.get('redirectTo') || '/';

	async function handleLogin() {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${window.location.origin}${redirectTo}`
			}
		});

		if (!error) {
			goto(redirectTo);
		}
	}

	async function loadUserProfile(user) {
		try {
			const { data: { session } } = await supabase.auth.getSession();
			const authToken = session?.access_token;
			
			const profileResponse = await getUserProfileByUserId(user.id, authToken);
			if (profileResponse.success) {
				sessionActions.setProfile({
					userSubscriptionLevel: profileResponse.data.userSubscriptionLevel,
					userRole: profileResponse.data.userRole,
					displayName: profileResponse.data.displayName
				});
				console.log('✅ User profile loaded after login:', profileResponse.data);
			} else {
				console.log('⚠️ Could not load user profile after login, creating new profile:', profileResponse.error);
				// Create user profile with free subscription level for first-time users
				await createUserProfileForNewUser(user, authToken);
			}
		} catch (error) {
			console.error('❌ Error loading user profile after login:', error);
		}
	}

	async function createUserProfileForNewUser(user, authToken) {
		try {
			console.log('🆕 Creating new user profile for first-time user...');
			
			// Create user profile data with free subscription level
			const profileData = createUserProfileData(user.id, {
				userRole: user.user_metadata?.role || 'student',
				displayName: user.user_metadata?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
				userSubscriptionLevel: 'free' // Set to free for new users
			});

			console.log('📝 Creating profile with data:', profileData);

			// Call the API to create the user profile
			const createResponse = await createUserProfileByUserId(profileData, authToken);
			
			if (createResponse.success) {
				console.log('✅ User profile created successfully:', createResponse.data);
				
				// Update session store with the new profile data
				sessionActions.setProfile({
					userSubscriptionLevel: profileData.userSubscriptionLevel,
					userRole: profileData.userRole,
					displayName: profileData.displayName
				});
			} else {
				console.error('❌ Failed to create user profile:', createResponse.error);
			}
		} catch (error) {
			console.error('❌ Error creating user profile for new user:', error);
		}
	}

	onMount(async () => {
		const {
			data: { user }
		} = await supabase.auth.getUser();

		if (user) {
			// Initialize session store
			sessionActions.setUser(user);
			
			// Load user profile
			await loadUserProfile(user);
			
			goto(redirectTo);
		} else {
			showLogin = true;
		}
	});
</script>

<div class="h-screen flex items-center justify-center">
	<button class="btn variant-filled" onclick={handleLogin}> Login </button>
</div>
