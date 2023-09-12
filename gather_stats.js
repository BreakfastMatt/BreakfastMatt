const { Octokit } = require('@octokit/core');
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const owner = 'BreakfastMatt';

async function gatherStatsForUser() {
  // Get a list of repositories for the user
  const { data: repos } = await octokit.request('GET /users/{owner}/repos', { owner });

  for (const repo of repos) {
    const repoName = repo.name;

    // Get the repository's stats
    const { data: repoStats } = await octokit.request('GET /repos/{owner}/{repo}/stats/contributors', { owner, repo: repoName });

    // Calculate total lines of code added and deleted
    let totalLinesAdded = 0;
    let totalLinesDeleted = 0;

    for (const contributor of repoStats) {
      for (const week of contributor.weeks) {
        totalLinesAdded += week.a;
        totalLinesDeleted += week.d;
      }
    }

    // Get the repository's pull requests
    const { data: pullRequests } = await octokit.request('GET /repos/{owner}/{repo}/pulls', { owner, repo: repoName });

    // Calculate the requested statistics
    const totalPRsCreated = pullRequests.length;
    let totalPRsMerged = 0;
    let totalPRsReviewed = 0;
    let totalCommentsOnPRs = 0;

    for (const pr of pullRequests) {
      if (pr.merged) {
        totalPRsMerged++;
      }

      // Get reviews for each pull request
      const { data: reviews } = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews', {
        owner,
        repo: repoName,
        pull_number: pr.number,
      });

      for (const review of reviews) {
        if (review.user.login !== owner) {
          totalPRsReviewed++;
        }
      }

      // Get comments on each pull request
      const { data: comments } = await octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}/comments', {
        owner,
        repo: repoName,
        issue_number: pr.number,
      });

      totalCommentsOnPRs += comments.length;
    }

    // Output the statistics for the repository
    console.log(`Statistics for ${owner}/${repoName}:`);
    console.log(`Total lines of code added: ${totalLinesAdded}`);
    console.log(`Total lines of code deleted: ${totalLinesDeleted}`);
    console.log(`Total number of pull requests created: ${totalPRsCreated}`);
    console.log(`Total number of pull requests merged: ${totalPRsMerged}`);
    console.log(`Total number of pull requests reviewed: ${totalPRsReviewed}`);
    console.log(`Total number of comments left on pull requests: ${totalCommentsOnPRs}`);
    console.log('\n');
  }
}

gatherStatsForUser().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
