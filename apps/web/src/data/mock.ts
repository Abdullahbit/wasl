// LEGACY SHIM — prefer importing from ./communities, ./resources, ./demoProfile
// Kept for backwards compat during hardening pass; new code should use services/.
export * from "./communities";
export * from "./resources";
export { ahmedProfile } from "./demoProfile";
