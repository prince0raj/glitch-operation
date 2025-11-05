import * as z from "zod";

export const ContestSubmissionSchema = z.object({
    steps: z.string(),
    uniqueCode: z.string(),
    improvements: z.string()
});

export type ContestSubmissionType = z.infer<typeof ContestSubmissionSchema>;
