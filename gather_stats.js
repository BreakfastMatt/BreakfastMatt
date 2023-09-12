// Check GitHub Access Token
const accessToken = process.env.ACCESS_TOKEN;
if (!accessToken) console.log(`GitHub access token is not defined.`);

// Configure OctoKit
const { Octokit } = require('@octokit/rest');
const octokit = new Octokit({ auth: accessToken });

// Fetch various repository statistics for the specified user
const gatherStatsForUser = async () => {
  try {
    // Get the list of all repositories for the user, including private ones
    const { data } = await octokit.repos.listForAuthenticatedUser();
    const repositoryDetails = data.map(repo => ({ name: repo.name, owner: repo.owner.login }));

    // Log repository details
    logRepositoryBasicDetails(repositoryDetails);
    console.log('Statistics gathered for all repositories.');
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
  console.log(`Total repositories = ${repositoryDetails.length}`);
}
