import { createClient } from "@supabase/supabase-js";
import { redirect } from "@sveltejs/kit";

const supabase = createClient(import.meta.env.VITE_ENV_supabaseUrl, import.meta.env.VITE_ENV_supabasekey);

const protectedRoutes = ["/spelling/", "/mytests/"];
export async function load({ url }) {
    // Do this login check for protected routes only, any new protected pages should be added to the array above
    const { data: { user } } = await supabase.auth.getUser();

    const isProtectedRoute = protectedRoutes.some(route => url.pathname.startsWith(route));
    
    if (isProtectedRoute) {
        if (!user && url.pathname !== '/auth/login') {
            throw redirect(302, `/auth/login?redirectTo=${url.pathname}`);
        }
    }

    return {
        data: user
    }
}