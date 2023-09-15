// Imports
import getAccessToken from "./getAccessToken.js";
import { getOctokit } from "./githubApi.js";
import { readFileContents } from "./readmeStats.js";

const pushReadMeUpdates = async () => {
    // Set up octokit
    console.log("Updating README file...\n")
    const username = "BreakfastMatt";
    const path = "README.md";
    const accessToken = getAccessToken();
    const octokit = getOctokit(accessToken);

    // Get current file data
    const { data: currentFileData } = await octokit.repos.getContent({ owner: username, repo: username, path });

    // Get the updated README file content
    const updatedReadmeContent = readFileContents('README.md');
    const updateFileContentBase64 = Buffer.from(updatedReadmeContent).toString('base64');

    // Update the README.md file with the new content
    await octokit.repos.createOrUpdateFileContents({
        owner: username,
        repo: username,
        path,
        message: 'Action - Update README.md with stats', // Commit message
        content: updateFileContentBase64, // Updated README file contents
        sha: currentFileData.sha // Current README file sha
    });
    console.log("README.md updated successfully.");
};

// Run and handle errors
pushReadMeUpdates().catch((error) => {
    console.error("Error:", error);
    process.exit(1);
});