// Check GitHub Access Token
const accessToken = process.env.ACCESS_TOKEN;
if (!accessToken) console.log(`GitHub access token is not defined.`);

// Configure OctoKit
const { Octokit } = require('@octokit/rest');
const octokit = new Octokit({ auth: accessToken });
const username = "BreakfastMatt";

// Collect all of the repository-level statics for the user
const collateStatisticsForUser = (name, repository) => {
    // Get user statistics for the repository
    const statistics = { commits: 0, codeAdded: 0, codeDeleted: 0 };
    const userRepoStatistics = repository.find((stats) => stats.author.login === username);
    console.log (`Repository stats for ${name}`, userRepoStatistics);
    if (!userRepoStatistics?.weeks) return { commits: 0, codeAdded: 0, codeDeleted: 0 }
    
    // Calculate the statistics
    userRepoStatistics.forEach(week => {
        // Gather totals
        statistics.commits += week.c;
        statistics.codeAdded += week.a;
        statistics.codeDeleted += week.d;
    });
    return statistics;
}

// Get the list of all repositories for the user, including private ones
const fetchRepositoryDetails = async () => {
    // Get the list of all repositories for the user, including private ones
    const { data: allRepos } = await octokit.repos.listForAuthenticatedUser();

    // Fetch the repository-level statistics
    const repoStatsPromises = allRepos.map(async (repo) => {
      const { data: repoStats } = await octokit.repos.getContributorsStats({ owner: repo.owner.login, repo: repo.name });
      const statistics = collateStatisticsForUser(repo.name, repoStats);
      const mappedRepoDetail = { name: repo.name, owner: repo.owner.login, statistics };
      return mappedRepoDetail;
    });
    const repositoryDetails = await Promise.all(repoStatsPromises);
    
    // Log repository details
    console.log("\nRepositories:");
    repositoryDetails.forEach(repo => console.log(`* ${repo.name} [commits = ${repo.statistics.commits}, codeAdded = ${repo.statistics.codeAdded}, codeDeleted = ${repo.statistics.codeDeleted}]`));
    console.log(`Total repositories = ${repositoryDetails.length}\n`);
    return repositoryDetails;
};

// Fetch various repository statistics for the specified user
const gatherStatsForUser = async () => {
  try {
    // Get the repository details for the user (public & private)
    const repositoryDetails = await fetchRepositoryDetails();
  } catch (error) {
    console.error('Error:', error);
  }
};

gatherStatsForUser().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
