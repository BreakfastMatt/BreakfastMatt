// Imports
import { Octokit } from '@octokit/rest';
import log from './log.js';

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
    log(repositoryList, `Number of repositories = ${repositoryList.length}`);
    return repositoryList;
};

export const fetchRepositoryStatisticsAsync = async (accessToken, repositoryList) => {
    const tasks = [];
    const octokit = getOctokit(accessToken);
    repositoryList.forEach(repository => {
        const { data: repoStats } = octokit.repos.getContributorsStats({ repo: repository.name, owner: repository.owner });
        tasks.push(repoStats);
    });
    const taskResponses = await Promise.all(tasks);
    log(taskResponses);
};