import { createClient } from "@supabase/supabase-js";
import { redirect } from "@sveltejs/kit";

const supabase = createClient(import.meta.env.VITE_ENV_supabaseUrl, import.meta.env.VITE_ENV_supabasekey);

const protectedRoutes = ["/spelling/mylists"];

export async function load({ url }) {
    // Do this login check for protected routes only, any new protected pages should be added to the array above
    const { data: { user } } = await supabase.auth.getUser();

    console.log(url.pathname);
    if (protectedRoutes.includes(url.pathname)) {
        if (!user && url.pathname !== '/auth/login') {
            throw redirect(302, `/auth/login?redirectTo=${url.pathname}`);
        }
    }

    return {
        data: user
    }
}