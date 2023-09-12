// Check GitHub Access Token
const accessToken = process.env.ACCESS_TOKEN;
if (!accessToken) console.log(`GitHub access token is not defined.`);

// Configure OctoKit
const { Octokit } = require('@octokit/rest');
const octokit = new Octokit({ auth: accessToken });

// Get the list of all repositories for the user, including private ones
const fetchRepositoryDetails = async () => {
    // Get the list of all repositories for the user, including private ones
    const { data: allRepos } = await octokit.repos.listForAuthenticatedUser();

    // Fetch the repository-level statistics
    const repoStatsPromises = allRepos.map(async (repo) => {
      const { data: repoStats } = await octokit.repos.getContributorsStats({ owner: repo.owner.login, repo: repo.name });
      const mappedRepoDetail = { name: repo.name, owner: repo.owner.login, statistics: repoStats };
      return mappedRepoDetail;
    });

    // Wait for all promises to resolve
    const repositoryDetails = await Promise.all(repoStatsPromises);
    return repositoryDetails;
};


// Fetch various repository statistics for the specified user
const gatherStatsForUser = async () => {
  try {
    // Get the repository details for the user (public & private)
    const repositoryDetails = await fetchRepositoryDetails();

    // Log repository details
    logRepositoryBasicDetails(repositoryDetails);
  } catch (error) {
    console.error('Error:', error);
  }
};

gatherStatsForUser().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});

// Log basic repository details (name, total count etc.)
const logRepositoryBasicDetails = (repositoryDetails) => {
  console.log("\nRepositories:");
  repositoryDetails.forEach(repo => console.log(`* ${repo.name}`));
  console.log(`Total repositories = ${repositoryDetails.length}\n`);
};
