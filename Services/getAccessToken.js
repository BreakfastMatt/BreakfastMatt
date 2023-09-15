// Imports
import { localAccessToken } from '../config.js';
import { consoleLog } from './log.js';

/**
 * Fetches the GitHub access token from the appropriate source 
 * (either from the local config.js file or GitHub repository secrets)
 * @returns The GitHub Personal Access Token
 */
const getAccessToken = () => {
    // Pull the access token from the correct source (GitHub secrets or )
    const accessToken = process.env.ACCESS_TOKEN ?? localAccessToken;
    if (!accessToken) consoleLog(`GitHub access token is not defined.`);
    return accessToken;
};

// Exports
export default getAccessToken;