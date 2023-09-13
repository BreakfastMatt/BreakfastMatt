// Imports
import { enableLogging } from '../config.js';

export const log = (...logDetail) => {
    // Short-circuit if logging is disabled
    if (!enableLogging) return;

    // Log all of the details
    console.log(logDetail);
}