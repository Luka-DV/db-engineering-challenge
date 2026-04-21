
import { setTimeout as sleep } from "node:timers/promises";

type RetryOptions = {
    maxAttempts?: number;
    delayInMs?: number;
    isRetryable?: (err: unknown) => boolean;
    onRetryLog?: (attempt: number, err: unknown) => void;
}

export async function withRetry<T>(
    asyncFunc: () => Promise<T>,
    retryOptions: RetryOptions = {} //so that withRetry(fn) works
): Promise<T>  {
    
    const { 
        maxAttempts = 3,
        delayInMs = 1000,  
        isRetryable, 
        onRetryLog 
    } = retryOptions;
    
    if(!Number.isFinite(maxAttempts) || maxAttempts < 1) {
        throw new Error("maxAttempts must be >= 1 and finite");
    }
    if(!Number.isFinite(delayInMs) || delayInMs < 0) {
        throw new Error("delayInMs must be >= 0 and finite");
    }    
    
    for(let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await asyncFunc();
            
        } catch (err) {
            if(attempt === maxAttempts) {
                throw err; //Callers should log terminal failures at the call site.
            }
            
            if(isRetryable && !isRetryable(err)) {
                throw err;
            }
            
            onRetryLog?.(attempt, err)
            
            const delay = delayInMs * 2**(attempt -1) //default: 1s, 2s
            await sleep(delay) //await new Promise (res => setTimeout(res, delay)); 
        }
    }
    
    // Unreachable — TypeScript can't prove loop exhaustiveness
    throw new Error(`Failed to connect after ${maxAttempts} attempts.`)
}



/* onRetryLog: (attempt, err) => {
  const msg = err instanceof Error ? err.message : String(err);
  logger.warn({ attempt, err: msg }, "retrying");
}
 */

/* 
// Test 1
let callCount = 0;
const flaky = async () => {
    callCount++;
    if (callCount < 3) throw new Error("simulated failure");
    return "success!";
};
const result = await retryFetch(flaky, { maxAttempts: 5, delayInMs: 500 });
console.log(result); // should print "success!" after 2 retries 

// Test 2: never succeeds → should throw after maxAttempts
const alwaysFails = async () => { throw new Error("nope"); };
try {
    await retryFetch(alwaysFails, { maxAttempts: 3, delayInMs: 500 });
} catch (e) {
    console.log("failed as expected:", (e as Error).message);
}


// Test 3: non-retryable error → should throw immediately
class AuthError extends Error {}
const unauthorized = async () => { throw new AuthError("401"); };
try {
    await retryFetch(unauthorized, {
        maxAttempts: 3,
        delayInMs: 100,
        isRetryable: (err) => !(err instanceof AuthError),
    });
} catch (e) {
    console.log("failed immediately:", (e as Error).constructor.name);
} */