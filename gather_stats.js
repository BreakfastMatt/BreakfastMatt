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
    const repositoryDetails = data.map(repo => { name: repo.name, owner: repo.owner.login });
    console.log(`repository details = ${repositoryDetails}`);
    
    const allRepos = data;
    let count = repoCount = 0;
    for (const repo of allRepos) {
      const owner = repo.owner.login;
      const repoName = repo.name;
      console.log(`* ${repoName}`);
      repoCount++;

      
    }
    console.log(`\nTotal repositories = ${repoCount}`);
    console.log('Statistics gathered for all repositories.');
  } catch (error) {
    console.error('Error:', error);
  }
};

gatherStatsForUser().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
