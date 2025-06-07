import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { v4 as uuidv4 } from 'uuid';

export const supabaseDb = createClient<Database>(
    import.meta.env.VITE_ENV_supabaseUrl,
    import.meta.env.VITE_ENV_supabasekey
);

export async function getAllUserListsByUserId(userId:string) {
    const result = await supabaseDb
                        .from('user_assignments_with_lists')
                        .select('*')
                        .eq("user_id", userId)
                        .returns<any[]>();

    return result.data;
}

export async function addUserListItems(list_id: string, words: string[]) {
    const dataToInsert = words.map((word, index) => ({ 
        list_id: list_id,  
        word_id: word,
        word_order: index + 1 // Adding word order
    }));

    const result = await supabaseDb
        .from('list_words')
        .insert(dataToInsert)
        .select()
        .returns<any[]>();

    return result.data;
}

export async function createList(userId: string, name: string, description: string, classVal: string) {
    const result = await supabaseDb
        .from('lists')
        .insert({
            created_by_teacher_id: userId,
            list_name: name,
            description: description,
            difficulty_level: classVal, // Assuming classVal is the difficulty level
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
           // is_active: true,
            is_public: false,
          //  is_deleted: false
        })
        .select()
        .returns<any[]>();

    if(result.error) {
        console.error("Error creating list:", result.error);
        throw result.error;
    }   

    return result.data;
}

export async function getListsCreatedByUser(userId: string) {
    debugger;
    const result = await supabaseDb
        .from('lists')
        .select('*')
        .eq('created_by_teacher_id', userId)
        .order('created_at', { ascending: false })
        .returns<Database['public']['Tables']['lists']['Row'][]>();

    if (result.error) {
        console.error("Error fetching user lists:", result.error);
        throw result.error;
    }

    return result.data;
}

export async function createAssignment(
    assigned_by_teacher_id: string,
    student_id: string,
    list_id: string,
    title: string,
    instructions: string | null,
    due_date: string | null
): Promise<Database['public']['Tables']['assignments']['Row'][]> {
    const assignmentId = uuidv4();

    const { data, error } = await supabaseDb
        .from('assignments')
        .insert({
            assignment_id: assignmentId,
            assigned_by_teacher_id: assigned_by_teacher_id,
            student_id: student_id,
            list_id: list_id,
            title: title,
            instructions: instructions,
            due_date: due_date,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .select()
        .returns<Database['public']['Tables']['assignments']['Row'][]>();

    if (error) {
        console.error("Error creating assignment:", error);
        throw error;
    }

    return data;
}

