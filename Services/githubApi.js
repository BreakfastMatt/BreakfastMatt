// Imports
import { Octokit } from '@octokit/rest';
import { log } from './log.js';

/**
 * Configure the octokit instance to call GitHub's API
 * @param {string} accessToken The GitHub Personal Access Token
 * @returns an authenticated octokit used to access GitHub's API
 */
const getOctokit = (accessToken) => {
    // Configure octokit using the accessToken
    const octokit = new Octokit({ auth: accessToken });
    return octokit;
};

/**
 * Fetches all of the public and private repositories for the authenticated user (as determined by the access token provided)
 * @param {string} accessToken The GitHub Personal Access Token
 * @returns an array of objects containing the name of the repository and owner.
 */
export const fetchUserRepositoriesAsync = async (accessToken) => {
    // Get the list of all repositories for the user, including private ones
    const octokit = getOctokit(accessToken);
    const { data: allRepos } = await octokit.repos.listForAuthenticatedUser();

    // Map and return the list of repositories
    const repositoryList = allRepos.map(repo => ({ name: repo.name, owner: repo.owner.login }));
    //log(repositoryList, `Number of repositories = ${repositoryList.length}`);
    return repositoryList;
};

/**
 * Fetches all of the repository contribution details for the specified user
 * @param {string} accessToken The GitHub Personal Access Token
 * @param {string} username The specified GitHub user 
 * @param {array} repositoryList An array containing the list of repositories the user has contributed to
 * @returns The repository details containing the raw stats
 */
export const fetchRepositoryDetailsAsync = async (accessToken, username, repositoryList) => {
    // Fetch all the user repository statistcs
    const octokit = getOctokit(accessToken);
    const tasks = repositoryList.map(async (repository) => {
        // Fetch the repository statisticsfor all contributors
        const { data: repoStats } = await octokit.repos.getContributorsStats({ owner: repository.owner, repo: repository.name });
        const success = Array.isArray(repoStats) && !!repoStats.find(repo => repo?.author?.login === username); // why does it fail so often :(
        if (!success) {
            log(`${repository.name} failed to fetch user statistics.`);
            return { name: repository.name, statistics: null, success };
        }

        // Get the specific user's contributions for the repository
        const userRepoStats = repoStats.find(repo => repo?.author?.login === username);
        return { name: repository.name, statistics: userRepoStats, success };
    });

    // Wait for all the promises to complete execution
    const taskResponses = await Promise.all(tasks);
    return taskResponses;
};