// Imports
import getAccessToken from './Services/getAccessToken.js';
import {
  fetchUserRepositoriesAsync,
  fetchRepositoryStatisticsAsync
} from './Services/githubApi.js';
import updateReadmeFile from './Services/readmeStats.js';

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
    const repositoryStatistics = await fetchRepositoryStatisticsAsync(accessToken, username, repositoryList);

    // Update ReadMe file with calculated statistics
    const statistics = { // TODO: temporary
      totalCommits: 1200,
      contributedRepoCount: 20,
      linesAdded: 25000,
      linesDeleted: 18000
    };
    updateReadmeFile(statistics);

    // const repositoryDetails = await fetchRepositoryDetails();
    // const userStatistics = collateFinalUserStatistics(repositoryDetails);
    // updateReadmeFileWithLatestStats(userStatistics);
  } catch (error) {
    console.error("Error:", error);
  }
};

// Handle Errors
gatherStatsForUserAsync().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});


// // Configure OctoKit
// const octokit = new Octokit({ auth: accessToken });
// const username = "BreakfastMatt";
// const filePath = "README.md";

// // Collect all of the repository-level statics for the user
// const collateStatisticsForUser = (name, repository) => {
//   // Get user statistics for the repository
//   const statistics = { commits: 0, codeAdded: 0, codeDeleted: 0 };
//   const hasValues = (repository?.length ?? 0) > 0; // TODO: why do we sometimes not have values here? (api failure or something else?)
//   const userRepoStatistics = hasValues ? repository.find((stats) => stats.author.login === username) : null;
//   //console.log (`Repository stats for ${name}`, userRepoStatistics);
//   if (!userRepoStatistics?.weeks) return { commits: 0, codeAdded: 0, codeDeleted: 0 }

//   // Calculate the statistics
//   userRepoStatistics.weeks.forEach(week => { // TODO: need to check that this detail is correct
//     // Gather totals
//     statistics.commits += week.c;
//     statistics.codeAdded += week.a;
//     statistics.codeDeleted += week.d;
//   });
//   return statistics;
// };

// // Get the list of all repositories for the user, including private ones
// const fetchRepositoryDetails = async () => {
//   // Get the list of all repositories for the user, including private ones
//   const { data: allRepos } = await octokit.repos.listForAuthenticatedUser();

//   // Fetch the repository-level statistics
//   const repoStatsPromises = allRepos.map(async (repo) => {
//     const { data: repoStats } = await octokit.repos.getContributorsStats({ owner: repo.owner.login, repo: repo.name });
//     const statistics = collateStatisticsForUser(repo.name, repoStats);
//     const mappedRepoDetail = { name: repo.name, owner: repo.owner.login, statistics };
//     return mappedRepoDetail;
//   });
//   const repositoryDetails = await Promise.all(repoStatsPromises);

//   // Log repository details
//   console.log("Repositories:");
//   repositoryDetails.forEach(repo => console.log(`* ${repo.name} [commits = ${repo.statistics.commits}, codeAdded = ${repo.statistics.codeAdded}, codeDeleted = ${repo.statistics.codeDeleted}]`));
//   console.log(`Total repositories = ${repositoryDetails.length}`);
//   return repositoryDetails;
// };

// // Calculate the total user statistics across all the repositories
// const collateFinalUserStatistics = (repositoryDetails) => {
//   const totalCommits = repositoryDetails.reduce((total, repo) => total + repo.statistics.commits, 0);
//   const codeAdded = repositoryDetails.reduce((total, repo) => total + repo.statistics.codeAdded, 0);
//   const codeDeleted = repositoryDetails.reduce((total, repo) => total + repo.statistics.codeDeleted, 0);
//   const userStats = { totalCommits, codeAdded, codeDeleted };
//   console.log("\nUser statistics:", userStats);
//   return userStats;
// };

// async function updateReadmeFileWithLatestStats(userStats) {
//   try {
//     // Construct the new content for the README.md file
//     const readmeContent = `
// # My GitHub Stats (generated using a custom GitHub action - likely inaccurate still)

// Total Commits: ${userStats.totalCommits}

// Lines Added: ${userStats.codeAdded}

// Lines Deleted: ${userStats.codeDeleted}
//     `;

//     // Encode the content in base64
//     const contentBase64 = Buffer.from(readmeContent).toString('base64');

//     // Get the current SHA of the README.md file
//     const { data: fileData } = await octokit.repos.getContent({ owner: username, repo: username, path: filePath });

//     // Update the README.md file with the new content
//     await octokit.repos.createOrUpdateFileContents({ owner: username, repo: username, path: filePath, message: 'Update README.md with stats', content: contentBase64, sha: fileData.sha });
//     console.log("\nREADME.md updated successfully.");
//   } catch (error) {
//     console.error('Error:', error);
//   }
// }