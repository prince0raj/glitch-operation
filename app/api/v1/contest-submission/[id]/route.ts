import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

type RouteParams = {
  params: {
    id: string;
  };
};

export async function GET(_request: Request, { params }: RouteParams) {
    try {
        const { id: contestID } = await params;
        const uniqueID = uuidv4();
        const supabaseClient = await createClient();
        const { data: contestData, error } = await supabaseClient.from('contests').select("id").eq("id", contestID).single();
        if(error || !contestData) {
            console.log(error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        const { data, error: insertionError } = await supabaseClient
            .from('contest_codes')
            .insert([
                { contest_id: contestData.id, code: uniqueID },
            ])
            .select();

        if(insertionError) {
            return NextResponse.json({ error: "Unable to generate the code" }, { status: 400 });
        }

        return NextResponse.json({ uniqueGeneratedCode: uniqueID });
    } catch(e) {
        let errorMessage = "Some unknown error occur";
        if(e instanceof Error) {
            return NextResponse.json({ error: e.message }, { status: 500 });
        }
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

}
