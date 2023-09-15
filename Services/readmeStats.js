// Imports
import { readFileSync, writeFileSync } from 'fs';

/**
 * Reads the contents from a file to a string
 * @param {string} filePath the path to the file
 * @returns The file contents in string format
 */
export const readFileContents = (filePath) => {
    const fileContents = readFileSync(filePath, 'utf-8');
    return fileContents;
};

/**
 * Takes in the user repository statistics and updates the readme file
 * @param {object} userStatistics An object containing the user's repository statistics
 */
export const updateReadmeFile = (userStatistics) => {
    // Read the template file
    const template = readFileContents('Templates/README.md.template', 'utf-8');

    // Replace placeholders with actual statistics
    const { totalCommits, contributedRepoCount, linesAdded, linesDeleted } = userStatistics;
    const readmeContent = template
        .replace('{{TOTAL_COMMITS}}', totalCommits)
        .replace('{{CONTRIBUTED_REPOS}}', contributedRepoCount)
        .replace('{{LINES_ADDED}}', linesAdded)
        .replace('{{LINES_DELETED}}', linesDeleted);

    // Write the updated README
    writeFileSync('README.md', readmeContent);
};