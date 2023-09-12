const { Octokit } = require('@octokit/rest');
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const username = 'BreakfastMatt';

async function gatherStatsForUser() {
  try {
    // Get the list of all repositories for the user, including private ones
    const { data: allRepos } = await octokit.repos.listForUser({ username });

    for (const repo of allRepos) {
      const repoName = repo.name;
      const owner = repo.owner.login;
      const repoDescription = repo.description || 'No description available';

      console.log(`Repository: ${owner}/${repoName}`);
      console.log(`Description: ${repoDescription}`);
      console.log(`Stars: ${repo.stargazers_count}`);
      console.log(`Forks: ${repo.forks_count}`);
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
