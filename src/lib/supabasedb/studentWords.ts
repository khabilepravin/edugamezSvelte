import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { v4 as uuidv4, v1 as uuidv1 } from 'uuid';

export const supabaseDb = createClient<Database>(
    import.meta.env.VITE_ENV_supabaseUrl,
    import.meta.env.VITE_ENV_supabasekey
);

const studentWordTable = 'student_words';

export async function addStudentWord(studentId: string,
    word: string,
    storyBookPageId: string,
    assisted: boolean,
    read: boolean) {
    const { data, error } = await supabaseDb
        .from(studentWordTable)
        .select('*')
        .eq('student_id', studentId)
        .eq('word', word)
        .eq('story_book_page_id', storyBookPageId)
        .limit(1);

    if (data?.length <= 0) {
        const currentDate = new Date();
        const timeStamp = currentDate.toISOString();

        await supabaseDb
            .from(studentWordTable)
            .insert([{
                id: uuidv4(),
                student_id: studentId,
                word: word,
                updated_date: timeStamp,
                added_date: timeStamp,
                assist_count: 1,
                story_book_page_id: storyBookPageId
            }]);
    }
    else {
        const currentDate = new Date();
        const timeStamp = currentDate.toISOString();

        if (assisted) {
            await supabaseDb
                .from(studentWordTable)
                .update({
                    assist_count: data[0].assist_count + 1,
                    updated_date: timeStamp
                })
                .eq('id', data[0].id);
        }

        if (read) {
            await supabaseDb
                .from(studentWordTable)
                .update({
                    read_count: data[0].read_count + 1,
                    updated_date: timeStamp
                })
                .eq('id', data[0].id);

        }
    }
}

export async function getStudentWordsByStoryBookPageId(studentId: string, storyBookPageId: string) {
    const { data, error } = await supabaseDb
        .from(studentWordTable)
        .select('*')
        .eq('student_id', studentId)
        .eq('story_book_page_id', storyBookPageId);

    if (!error) {
        return data;
    }

    console.log(error);
}