const { Octokit } = require('@octokit/rest');
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

async function gatherStatsForUser() {
  const username = 'BreakfastMatt'; // Replace with your GitHub username

  try {
    // Get the list of all repositories for the user, including private ones
    const { data: allRepos } = await octokit.repos.listForAuthenticatedUser({ visibility: 'all' });

    for (const repo of allRepos) {
      const repoName = repo.name;
      const owner = repo.owner.login;

      // Fetch and calculate statistics for the repository (you can adapt your existing logic here)
      // ...

      // Output the statistics for the repository
      console.log(`Statistics for ${owner}/${repoName}:`);
      console.log(`Total lines of code added: ${totalLinesAdded}`);
      console.log(`Total lines of code deleted: ${totalLinesDeleted}`);
      console.log(`Total number of pull requests created: ${totalPRsCreated}`);
      console.log(`Total number of pull requests merged: ${totalPRsMerged}`);
      console.log(`Total number of pull requests reviewed: ${totalPRsReviewed}`);
      console.log(`Total number of comments left on pull requests: ${totalCommentsOnPRs}`);
      console.log(`Average time to respond to a pull request: ${averageResponseTime} days`);
      console.log('\n');
    }

    console.log('Statistics gathered for all repositories.');
  } catch (error) {
    console.error('Error:', error);
  }
}

gatherStatsForUser().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
