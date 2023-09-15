// Imports
import getAccessToken from "./getAccessToken";
import { getOctokit } from "./githubApi";
import { readFileContents } from "./readmeStats";

const pushReadMeUpdates = async () => {
    // Set up octokit and baseRequest
    const accessToken = getAccessToken();
    const username = "BreakfastMatt";
    const octokit = getOctokit(accessToken);
    const baseRequest = { owner: username, repo: username, path: 'README.md' };

    // Get current README.md file content
    const currentFileContent = await octokit.repos.getContent({ ...baseRequest, ref: 'main' })
    const currentFileContentBase64 = Buffer.from(currentFileContent.data.content, 'base64').toString('utf-8');

    // Get updated README.md file content
    const updatedFileContent = readFileContents('README.md');
    const updatedFileContentBase64 = Buffer.from(updatedFileContent).toString('base64');

    // Push update file
    await octokit.repos.createOrUpdateFileContents({
        ...baseRequest, // Base request details
        message: 'ACTION - Update README stats', // Commit message
        branch: 'main', // Branch to run against
        sha: currentFileContentBase64.sha, // Current file sha
        content: updatedFileContentBase64, // Updated file contents
    });
};