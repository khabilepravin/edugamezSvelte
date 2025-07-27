import { createClient } from "@supabase/supabase-js";
import { redirect } from "@sveltejs/kit";
import { getUserProfileByUserId } from "$lib/api/userProfiles";

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
                console.log('⚠️ Could not load user profile:', profileResponse.error);
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