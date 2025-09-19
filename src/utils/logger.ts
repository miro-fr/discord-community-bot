// Simple logger wrapper to avoid adding heavy dependencies in this repo
export const logInfo = (message: string) => {
    console.log(`[INFO] ${message}`);
};

export const logError = (message: string) => {
    console.error(`[ERROR] ${message}`);
};

export const logWarning = (message: string) => {
    console.warn(`[WARN] ${message}`);
};