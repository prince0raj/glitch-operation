import { SupabaseClient } from "@supabase/supabase-js";
import { ContestSubmissionType } from "./schema/contest_submission_schema";

export const getContestDetails = async (supabase: SupabaseClient, id: string) => {
    const { data: contestDetails, error } = await supabase.from('contests').select().eq('id', id).limit(1).single();
    if(error) {
        throw new Error("Contest id does not exist");
    }

    return contestDetails;
}

export const getContestStatusForUser = async (supabase: SupabaseClient, contestId: string, profileId: string) => {
    const { data: contestStatusDetails, error } = await supabase.from('contest_status').select("status").eq('contest_id', contestId).eq('profile_id', profileId).maybeSingle();
    if(contestStatusDetails == null) {
        return null;
    }

    return contestStatusDetails.status as string;
}

export const validateContestCode = async (supabase: SupabaseClient, contestID: string, code: string) => {
    const { data: contestCodeData, error } = await supabase.from('contest_codes').select().eq('contest_id', contestID).eq('code', code).eq('is_active', true).limit(1).single();
    if(error) {
        return false;
    }

    return true;

}

export const insertIntoProfileActivities = async (supabase: SupabaseClient, metaData: ContestSubmissionType, codeStatus: boolean, contestId: string, profileId: string) => {
    const { data, error } = await supabase.from('profile_activities').insert([ {contest_id: contestId, profile_id: profileId, status: codeStatus ? "ACCEPTED" : "REJECTED", steps: metaData.steps, improvements: metaData.improvements, unique_code: metaData.uniqueCode  } ]).select()
    if(error) {
        throw new Error("Unable to accept the response");
    }

    return data;
}


export const insertIntoContestStatus = async (supabase: SupabaseClient, codeStatus: boolean, contestId: string, profileId: string) => {

    const contestSubmissionsDetails = await getContestStatusForUser(supabase, contestId, profileId);

    if(!contestSubmissionsDetails) {
        await supabase.from('contest_status').insert([{ profile_id: profileId, contest_id: contestId, status: codeStatus ? "ACCEPTED" : "REJECTED" }]);
        return;
    }

    if(contestSubmissionsDetails !== "ACCEPTED") {
        await supabase.from('contest_status').upsert([{ profile_id: profileId, contest_id: contestId, status: codeStatus ? "ACCEPTED" : "REJECTED" }], { onConflict: 'profile_id,contest_id' });
    }

    return;
}

export const updateCodeStatus = async (supabase: SupabaseClient, contestID: string) => {
    await supabase.from('contest_codes').update({ is_active: false }).eq('contest_id', contestID).select();
}
