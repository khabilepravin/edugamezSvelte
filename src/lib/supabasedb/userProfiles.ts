import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'

export const supabaseDb = createClient<Database>(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY
);

type Role = 'teacher' | 'parent' | 'student';

interface UserProfileLink {
    created_at: string;
    last_updated: string;
    parent_user_id?: string;
    user_id: string;
    is_active: boolean;
    class_level: number;
    literacy_level: number;
    class_name: string;
    display_name: string;
}

export interface User {
    id?: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: Role;
    avatar?: string;
    parent_id: string;
    class_level: number;
    class_name: string;
    display_name: string;
}

export async function getUserProfileLinksByParentId(parentId: string) {
    try {
        const { data, error } = await supabaseDb
            .from('user_profile_link_users_vw')
            .select('*')
            .eq('parent_user_id', parentId);
        if (error) {
            throw new Error('Error retrieving user profile links');
        }

        return data;
    } catch (error) {
        // Handle the error here
        console.error('Error retrieving user profile links:', error);
        throw error;
    }
}


export async function addUserProfileLink(userProfile: UserProfileLink) {
    try {
        console.log(userProfile);
        const result = await supabaseDb.from('user_profile_link').upsert([
            {
                is_active: userProfile.is_active,
                parent_user_id: userProfile.parent_user_id,
                user_id: userProfile.user_id,
                created_at: new Date().toISOString(),
                last_updated: new Date().toISOString(),
                class_level: userProfile.class_level,
                literacy_level: userProfile.literacy_level,
                class_name: userProfile.class_name,
                display_name: userProfile.display_name
            }
        ]);

        return result.data;
    } catch (error) {
        // Handle the error here
        console.error('Error adding user profile link:', error);
        throw error;
    }
}

export async function addUser(userProfile: User) {
    try {
        const result = await supabaseDb.auth.signUp({
            email: userProfile.email,
            password: userProfile.password,
            options: {
                data: {
                    email_confirmed_at: Date.now(),
                    confirmation_sent_at: Date.now(),
                    role: userProfile.role,
                }
            }
        });

        console.log(result);
        if (result.error) {
            throw new Error('Error adding user');
        }

        await addUserProfileLink({
            created_at: new Date().toISOString(),
            last_updated: new Date().toISOString(),
            user_id: result.data?.user?.id as string,
            parent_user_id: userProfile.parent_id,
            is_active: true,
            class_level: userProfile.class_level,
            literacy_level: userProfile.class_level, // TODO: Take literacy level as well from the front-end
            class_name: userProfile.class_name,
            display_name: userProfile.display_name
        });

        return result.data;
    } catch (error) {
        // Handle the error here
        console.error('Error adding user:', error);
        throw error;
    }
}

export async function getUserById(userId: string) {
    try {
        const { data, error } = await supabaseDb
            .from('user_profile_link_users_vw')
            .select('*')
            .eq('id', userId);
        if (error) {
            throw new Error('Error retrieving user profile links');
        }

        return data;
    } catch (error) {
        // Handle the error here
        console.error('Error retrieving user profile links:', error);
        throw error;
    }
}

export async function updateUserProfile(userData: any) {
    let id: string = userData.id?.toString();
    try {
        const { error } = await supabaseDb
            .from('user_profile_link')
            .update({
                display_name: userData.display_name,
                class_level: userData.class_level,
                class_name: userData.class_name
            })
            .eq('id', id);

        return error;
    }
    catch (error) {
        console.log('Error updating user profile:', error);
    }

}