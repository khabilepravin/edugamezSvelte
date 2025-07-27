import { createClient } from "@supabase/supabase-js";
import { redirect } from "@sveltejs/kit";
import { getUserProfileByUserId, createUserProfileByUserId, createUserProfileData } from "$lib/api/userProfiles";

const supabase = createClient(import.meta.env.VITE_ENV_supabaseUrl, import.meta.env.VITE_ENV_supabasekey);

const protectedRoutes = ["/spelling/", "/mytests/", "/payment"];

export async function load({ url }) {
    // Do this login check for protected routes only, any new protected pages should be added to the array above
    const { data: { user } } = await supabase.auth.getUser();

    const isProtectedRoute = protectedRoutes.some(route => url.pathname.startsWith(route));
    
    if (isProtectedRoute) {
        if (!user && url.pathname !== '/auth/login') {
            throw redirect(302, `/auth/login?redirectTo=${url.pathname}`);
        }
    }

    // Fetch user profile if user is authenticated
    let userProfile = null;
    if (user) {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const authToken = session?.access_token;
            
            const profileResponse = await getUserProfileByUserId(user.id, authToken);
            if (profileResponse.success) {
                userProfile = profileResponse.data;
                console.log('✅ User profile loaded:', userProfile);
            } else {
                console.log('⚠️ Could not load user profile, creating new profile:', profileResponse.error);
                // Create user profile with free subscription level for first-time users
                const profileData = createUserProfileData(user.id, {
                    userRole: user.user_metadata?.role || 'student',
                    displayName: user.user_metadata?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                    userSubscriptionLevel: 'free' // Set to free for new users
                });

                const createResponse = await createUserProfileByUserId(profileData, authToken);
                if (createResponse.success) {
                    userProfile = profileData; // Use the data we sent since API returns text
                    console.log('✅ User profile created successfully for new user');
                } else {
                    console.error('❌ Failed to create user profile:', createResponse.error);
                }
            }
        } catch (error) {
            console.error('❌ Error loading user profile:', error);
        }
    }

    return {
        data: user,
        userProfile: userProfile
    }
}