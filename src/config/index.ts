import { z } from "zod";


const ghRepoSchema = z.string()
    .transform((ownerRepoString, ctx) => {
        const [owner, repoName, ...rest] = ownerRepoString.split("/");
        if(!owner || !repoName || rest.length > 0) {
            ctx.issues.push({
                code: "custom",
                message: `Invalid owner/repo format: ${ownerRepoString}`,
                input: ownerRepoString,
            })
            return z.NEVER;
        };
        
        return {owner, repoName};
    });


const envDataSchema = z.object({
    DBOX_API_KEY: z.string().trim().min(1),
    DBOX_GITHUB_DATASET_ID: z.uuid(), // alternative: z.guid()
    DBOX_NASA_DATASET_ID: z.uuid(),

    GH_ACCESS_TOKEN: z.string().trim().min(1),
    GH_REPOS: z.string()
        .trim()
        .min(1)
        .transform(string => {
            return string.split(",")
            .map(ghPair => ghPair.trim())
            .filter(Boolean)
        })
        .pipe(z.array(ghRepoSchema).min(1, "GH_REPOS must contain at least one valid owner/repo")),

    NASA_API_KEY: z.string().trim().min(1),

    /* DRY_RUN: z.string()
        .trim()
        .toLowerCase()
        .transform(string => {
            if(string === "false") return false;
            else return true;
        }).default(true) */

    DRY_RUN: z.stringbool().default(true), // Zod v4
                                                       
    LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"])
                   .default("info"),
});


export const config = envDataSchema.parse(process.env);

export type Config = typeof config;