


export type JsonPrimitive = string | number | boolean | null;
export type DataRecord = Record<string, JsonPrimitive>;

export type Provider = "github" | "nasa";

export type SyncResult =
 | {
     provider: Provider;
     success: true;
     rowsSent: number;
   }
 | {
     provider: Provider;
     success: false; //exclude?
     error: string;
   };