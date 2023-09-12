const { Octokit } = require('@octokit/rest');
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const username = 'BreakfastMatt';

async function gatherStatsForUser() {
  try {
    // Get the list of all repositories for the user, including private ones
    const { data: allRepos } = await octokit.repos.listForUser({ username, type: 'all' });

    // Gather some basic repository statistics
    let count = repoCount = 0;
    for (const repo of allRepos) {
      const repoName = repo.name;
      console.log(`* ${repoName}`);
      repoCount++;
    }
    console.log(`\nTotal repositories = ${repoCount}`);
    console.log('Statistics gathered for all repositories.\n');
  } catch (error) {
    console.error('Error:', error);
  }
}

gatherStatsForUser().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});