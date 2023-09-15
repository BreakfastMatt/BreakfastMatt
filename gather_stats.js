// Imports
import collateRepositoryStatistics from './Services/collateUserStatistics.js';
import getAccessToken from './Services/getAccessToken.js';
import {
  fetchUserRepositoriesAsync,
  fetchRepositoryDetailsAsync
} from './Services/githubApi.js';
import { logAndReturn } from './Services/log.js';
import { updateReadmeFile } from './Services/readmeStats.js';

/**
 * Fetch various repository statistics for the specified user
 */
const gatherStatsForUserAsync = async () => {
  try {
    // Pull GitHub Access Token from the appropriate source
    const accessToken = getAccessToken();

    // Fetch the repository details for the user (public & private)
    const repositoryList = await fetchUserRepositoriesAsync(accessToken);

    // Fetch the repository statistics
    const username = "BreakfastMatt";
    const repositoryDetails = await fetchRepositoryDetailsAsync(accessToken, username, repositoryList);

    // Collate the repository statistics
    const repositoryStatistics = collateRepositoryStatistics(repositoryDetails);

    // Update ReadMe file with calculated statistics
    updateReadmeFile(repositoryStatistics);

    // Success state
    return logAndReturn(repositoryStatistics, "Final statistics: \n", true);
  } catch (error) {
    console.error("Error:", error);
  }
};

// Handle Errors
gatherStatsForUserAsync().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});