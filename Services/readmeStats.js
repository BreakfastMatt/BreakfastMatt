// Imports
import { readFileSync, writeFileSync } from 'fs';

/**
 * Takes in the user repository statistics and updates the readme file
 * @param {object} userStatistics An object containing the user's repository statistics
 */
const updateReadmeFile = (userStatistics) => {
    // Read the template file
    const template = readFileSync('Templates/README.md.template', 'utf-8');

    // Replace placeholders with actual statistics
    const {totalCommits, contributedRepoCount, linesAdded, linesDeleted } = userStatistics;
    const readmeContent = template
        .replace('{{TOTAL_COMMITS}}', totalCommits)
        .replace('{{CONTRIBUTED_REPOS}}', contributedRepoCount)
        .replace('{{LINES_ADDED}}', linesAdded)
        .replace('{{LINES_DELETED}}', linesDeleted);

    // Write the updated README
    writeFileSync('README.md', readmeContent);
};

// Exports
export default updateReadmeFile;