const collateRepositoryStatistics = (repositoryDetails) => {
    // Collate all the repository statistics
    const repositoryStatistics = repositoryDetails.map(repoDetail => {
        // Short-circuit mapping if there aren't any statistics
        const statistics = { name: repoDetail.name, commits: 0, codeAdded: 0, codeDeleted: 0, success: repoDetail.success };
        if (!statistics.success || (repoDetail.statistics?.weeks?.length ?? 0) === 0) return statistics;

        // Compile the repository statistics
        repoDetail.statistics.weeks.forEach(week => {
            statistics.commits += week?.c ?? 0;
            statistics.codeAdded += week?.a ?? 0;
            statistics.codeDeleted += week?.d ?? 0;
        });
        return statistics;
    });

    // Calculate the summarised user statistics
    const totalCommits = repositoryStatistics.reduce((total, repo) => total + repo.commits, 0);
    const contributedRepoCount = repositoryStatistics.length;
    const linesAdded = repositoryStatistics.reduce((total, repo) => total + repo.codeAdded, 0);
    const linesDeleted = repositoryStatistics.reduce((total, repo) => total + repo.codeDeleted, 0);
    return { totalCommits, contributedRepoCount, linesAdded, linesDeleted };
};

// Exports
export default collateRepositoryStatistics;