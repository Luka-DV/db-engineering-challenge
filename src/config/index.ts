/* 
DBOX_API_KEY=your_databox_api_key

# Used only for one-time data source/dataset creation via curl:
# DBOX_ACCOUNT_ID=123456
# DBOX_DATA_SOURCE_ID=1234567

DBOX_GITHUB_DATASET_ID=your_gh_dataset_id
DBOX_NASA_DATASET_ID=your_nasa_dataset_id

GH_ACCESS_TOKEN=your_gh_personal_access_token
GH_REPOS=microsoft/TypeScript,axios/axios,nodejs/node

NASA_API_KEY=your_nasa_api_key
*/

import { z } from "zod";


const ghRepoSchema = z.string()
    .transform((ownerRepoString, ctx) => {
        const [owner, repoName, ...rest] = ownerRepoString.split("/");
        if(!owner || !repoName || rest.length > 0) {
            ctx.issues.push({
                code: "custom",
                message: `Invalid owner/repo format: ${ownerRepoString}`,
                input: ownerRepoString,
            });
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
        .pipe(z.array(ghRepoSchema)),

    NASA_API_KEY: z.string().trim().min(1),

    DRY_RUN: z.string()
        .trim()
        .toLowerCase()
        .transform(string => {
            if(string === "false") return false;
            else return true;
        }).default(true)
});


export const config = envDataSchema.parse(process.env);

export type Config = typeof config;