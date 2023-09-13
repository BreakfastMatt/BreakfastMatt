// Imports
import { enableLogging } from '../config.js';

const log = (...logDetail) => {
    // Short-circuit if logging is disabled
    if (!enableLogging) return;

    // Log all of the details
    console.log(logDetail);
}

// Exports
export default log;