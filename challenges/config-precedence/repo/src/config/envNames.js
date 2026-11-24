export const PREFIX = "APP_";

/** APP_LOG_LEVEL -> log_level */
export const keyFromEnv = (name) => name.slice(PREFIX.length).toLowerCase();

/** log_level -> APP_LOG_LEVEL */
export const envFromKey = (key) => PREFIX + key.toUpperCase();
